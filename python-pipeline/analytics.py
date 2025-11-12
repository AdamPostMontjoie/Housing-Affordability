import pandas as pd
from supabase import Client, create_client
from dotenv import load_dotenv
import os

load_dotenv() 


url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)


affordability_response = supabase.table('fact_affordability') \
                                .select('id','location_id','affordability_value','price','income','year','month','name') \
                                .neq('year',2025) \
                                .order('location_id') \
                                .order('year') \
                                .order('month') \
                                .execute()
df = pd.DataFrame(affordability_response.data)

window = 60

#calculates rolling average based on mean, grouped by location
df['five_year_rolling_income'] = df.groupby('location_id')['income'].rolling(window=window, min_periods=1).mean().reset_index(level=0, drop=True)
df['five_year_rolling_price'] = df.groupby('location_id')['price'].rolling(window=window, min_periods=1).mean().reset_index(level=0, drop=True)

#calculates rolling volatility based on standard deviation, grouped by location
df['five_year_volatility_income'] = df.groupby('location_id')['income'].rolling(window=window, min_periods=1).std().fillna(0).reset_index(level=0, drop=True)
df['five_year_volatility_price'] = df.groupby('location_id')['price'].rolling(window=window, min_periods=1).std().fillna(0).reset_index(level=0, drop=True)  

data_to_upsert = df.to_dict('records')

supabase.table('fact_affordability') \
    .upsert(data_to_upsert)\
    .execute()
    