import pandas as pd
import os
import argparse
from supabase import Client, create_client

parser = argparse.ArgumentParser(description="Load income data from a CSV.")
parser.add_argument("-id", "--location_id", 
                    help="The id of the state", #0 for usa, 1-50 for states in order of joining union 51 for DC
                    required=True)


args = parser.parse_args()
location_id = args.location_id

url = "https://scazzvmwfjjyrbmitrfx.supabase.co"
key = "sb_secret_B4qyWkXFNv9uazN1bh0H7g_PWZ1GlfP" # This looks like your service key

supabase: Client = create_client(url, key)

raw_data = supabase.table("raw_income_data") \
            .select("*") \
            .eq("location_id",location_id) \
            .order("observation_date") \
            .execute()
df = pd.DataFrame(raw_data.data)

# use ts to get state names (change name of usa by reinserting to supabase)
cleaned_string = df['source_file'].str.replace("income", "").str.replace(".csv", "")
df['name'] = cleaned_string
df = df.drop(columns=['source_file'])

#replace with specific year
year = pd.to_datetime(df['observation_date']).dt.year
df['year'] = year
df = df.drop(columns=['observation_date'])


data_to_insert = df.to_dict('records')
try:
    load_response = supabase.table('fact_income').insert(data_to_insert).execute()
    print(f"successful insertion of {cleaned_string.iloc[0]}")
except Exception as e:
    print(e)

