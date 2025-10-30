import pandas as pd
import sys
import os
from supabase import Client, create_client
import argparse
from dotenv import load_dotenv
import numpy as np

load_dotenv()

#command line file arguments
parser = argparse.ArgumentParser(description="Load income data from a CSV.")
parser.add_argument("-f", "--file", 
                    help="Path to the input CSV file", 
                    required=True)
args = parser.parse_args()

filepath = args.file
filename = os.path.basename(filepath)

# 1. (E) Extract: Read the "wide" CSV
try:
    df_wide = pd.read_csv(filepath)
except Exception as e:
    print(f"Error reading CSV: {e}")
    sys.exit(1)

# 2. (T1) Transform: "Melt" the data
#    This is the magic. It takes all columns *except* 'date'
#    and "unpivots" them.
df_long = pd.melt(
    df_wide,
    id_vars=['date'],             # The column(s) to keep as-is
    var_name='name',  # Name for the *new* column (was the header)
    value_name='price'          # Name for the *new* value column
)

# 3. Clean the 'raw_state_name' column
#    (e.g., from 'california_price' to 'california')
df_long['name'] = df_long['name'].str.lower().str.replace(" ", "")

#drop all blank prices
df_long.replace(np.nan, None, inplace=True)

# file name
df_long['source_file'] = filename

raw_data_to_insert = df_long.to_dict('records')


url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)

#insert raw data
try:
    raw_response = supabase.table('raw_housing_data').insert(raw_data_to_insert).execute()
except Exception as e:
     print(f"Error during ELT process: {e}")

#configure fact_housing

#get location data to match ids
try:
    location_response = supabase.table('dim_location').select('*').execute()
    df_dim_location = pd.DataFrame(location_response.data)
    df_dim_location['name'] = df_dim_location['name'].str.lower().str.replace(" ", "")
except Exception as e:
    print(f"Error during ELT process: {e}")

location_map = df_dim_location.set_index('name')['location_id']
df_long['location_id'] = df_long['name'].map(location_map)


date_format = "%m/%d/%y"

year = pd.to_datetime(df_long['date'], format=date_format).dt.year
month = pd.to_datetime(df_long['date'], format=date_format).dt.month

df_long['year'] = year
df_long['month'] = month

df_long = df_long.drop(columns=['date'])
df_long = df_long.drop(columns=['source_file'])

fact_housing_to_insert = df_long.to_dict('records')

try:
    fact_housing_response = supabase.table('fact_housing').insert(fact_housing_to_insert).execute()
except Exception as e:
    print(f"Error during ELT process: {e}")