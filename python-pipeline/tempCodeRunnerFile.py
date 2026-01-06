import pandas as pd
import os
import argparse
from supabase import Client, create_client
from dotenv import load_dotenv
from prophet import Prophet
from prophet.serialize import model_to_json


load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)

def create_forecast():
    #pull mortgage data as regressor
    mortgage_response = supabase.table('fact_mortgage').select('year','month','rate').execute()
    df_mortgage = pd.DataFrame(mortgage_response.data)
    df_mortgage['ds'] = pd.to_datetime(df_mortgage[['year','month']].assign(day=1))
    df_mortgage = df_mortgage[['ds','rate']].copy()

    #store create and store 52 models in supabase bucket
    predictions = []
    for loc_id in range(0,52):
        response = supabase.table('fact_housing').select('location_id, price, year, month').eq('location_id',loc_id).execute()
        df_housing = pd.DataFrame(response.data)

        #create ds for prophet format
        df_housing['ds'] = pd.to_datetime(df_housing[['year','month']].assign(day=1))
        loc_df = df_housing[df_housing['location_id'] == loc_id].copy()
        loc_df = loc_df.rename(columns={'price':'y'})
        loc_df = pd.merge(loc_df,df_mortgage, on='ds',how='inner')
        #create prophet model
        m = Prophet()
        m.add_regressor('rate')
        m.fit(loc_df)
        json_model = model_to_json(m)
        # future = m.make_future_dataframe(periods=60,freq="MS")
        # forecast = m.predict(future)
        # #drop all past months
        # forecast = forecast[forecast['ds'] > loc_df['ds'].max()]
        # for _, row in forecast.iterrows():
        #     predictions.append({
        #         'location_id':loc_id,
        #         'price': row['yhat'],
        #         'lower':row['yhat_lower'],
        #         'upper':row['yhat_upper'],
        #         'date':row['ds'].strftime('%Y-%m-%d')
        #     })
        try:
            supabase.storage \
            .from_('prophet-models') \
            .upload(
                path=f'model_{loc_id}.json',
                file=json_model,
                file_options={"upsert": "true"}
            )
            print(f"uploaded file to supabase")
        except Exception as e:
            print(f"failed to upload model {e}")
    # try:
    #     print(f"Uploading {len(predictions)} predictions")
    #     supabase.table('fact_predictions').upsert(predictions).execute()
    # except Exception as e:
    #     print(e)
    #     print(f"Failed to upload {len(predictions)} predictions")
create_forecast()
   