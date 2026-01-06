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
        #encode model for storage
        file_bytes = json_model.encode('utf-8')
        try:
            result = supabase.storage \
            .from_('prophet-models') \
            .upload(
                path=f'model_{loc_id}.json',
                file=file_bytes,
                file_options={"upsert": "true"}
            )
            print(result)

        except Exception as e:
            print(f"failed to upload model {e}")
  
create_forecast()
   