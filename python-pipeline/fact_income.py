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
df['observation_date'] = pd.to_datetime(df['observation_date'])

df = df.set_index('')


