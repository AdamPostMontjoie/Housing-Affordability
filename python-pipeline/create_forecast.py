import pandas as pd
import os
import argparse
from supabase import Client, create_client
from dotenv import load_dotenv
from prophet import Prophet

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)

def create_forecast():
    predictions = []
    for loc_id in range(0,52):
        response = supabase.table('fact_housing').select('location_id, price, year, month').eq('location_id',loc_id).execute()
        df_housing = pd.DataFrame(response.data)

        #create ds for prophet format
        df_housing['ds'] = pd.to_datetime(df_housing[['year','month']].assign(day=1))
        loc_df = df_housing[df_housing['location_id'] == loc_id].copy()
        loc_df = loc_df.rename(columns={'price':'y'})
        #create prophet model
        m = Prophet()
        m.fit(loc_df)
        future = m.make_future_dataframe(periods=60,freq="MS")
        forecast = m.predict(future)
        #drop all past months
        forecast = forecast[forecast['ds'] > loc_df['ds'].max()]
        for _, row in forecast.iterrows():
            predictions.append({
                'location_id':loc_id,
                'price': row['yhat'],
                'lower':row['yhat_lower'],
                'upper':row['yhat_upper'],
                'date':row['ds'].strftime('%Y-%m-%d')
            })
    try:
        print(f"Uploading {len(predictions)} predictions")
        supabase.table('fact_predictions').upsert(predictions).execute()
    except Exception as e:
        print(e)
        print(f"Failed to upload {len(predictions)} predictions")
create_forecast()
   