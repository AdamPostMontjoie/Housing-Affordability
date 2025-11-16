import pandas as pd
import sys
import os
from supabase import Client, create_client
import argparse
from dotenv import load_dotenv
import numpy as np

load_dotenv()

#command line file arguments
parser = argparse.ArgumentParser(description="Load housing data from a CSV.")
parser.add_argument("-f", "--file", 
                    help="Path to the input CSV file", 
                    required=True)
args = parser.parse_args()

filepath = args.file
filename = os.path.basename(filepath)


df_raw = pd.read_csv(filepath)

#drop unused columns
df_raw = df_raw.drop(columns=['Effective Tax Rate (2022)'])
df_raw = df_raw.drop(columns=['Rank'])

#rename
df_raw = df_raw.rename(columns={"State":"name","Effective Tax Rate (2023)":"tax_rate"})


url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)
# #get location data to match ids
try:
    location_response = supabase.table('dim_location').select('*').execute()
    df_dim_location = pd.DataFrame(location_response.data)

    #format names
    df_dim_location['name'] = df_dim_location['name'].str.lower().str.replace(" ", "")
    df_raw['name'] = df_raw['name'].str.lower().str.replace(" ", "")
except Exception as e:
    print(f"Error during ELT process: {e}")

#where name matches id in dim_location, set location_id
location_map = df_dim_location.set_index('name')['location_id']
df_raw['location_id'] = df_raw['name'].map(location_map)

#remove percent frome rate
df_raw['tax_rate'] = df_raw['tax_rate'].str.replace("%","")

data_to_insert = df_raw.to_dict('records')

try:
    supabase.table('fact_property_tax').insert(data_to_insert).execute()
except Exception as e:
    print(f"Error during ELT process: {e}")