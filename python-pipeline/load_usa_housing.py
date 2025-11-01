#the main zillow document does not contain usa housing, so need new pipeline
import pandas as pd
import sys
import os
from supabase import Client, create_client
import argparse
from dotenv import load_dotenv
import numpy

load_dotenv()

#command line file arguments
parser = argparse.ArgumentParser(description="Load income data from a CSV.")
parser.add_argument("-f", "--file", 
                     help="Path to the input CSV file", 
                    required=True)
args = parser.parse_args()

filepath = args.file
filename = os.path.basename(filepath)



# melt into proper shape
try:
    df_row= pd.read_csv(filepath,nrows=1)
except Exception as e:
    print(f"Error reading CSV: {e}")
    sys.exit(1)
indicies = numpy.r_[1,5:314]

df_wide = df_row.iloc[:,indicies]

df_long = pd.melt(
    df_wide,
    id_vars = ['SizeRank'],
    var_name='date',
    value_name='price'
)

df_long = df_long.rename(columns={'SizeRank':'location_id'})

date_format = "%Y-%m-%d"

year = pd.to_datetime(df_long['date'], format=date_format).dt.year
month = pd.to_datetime(df_long['date'], format=date_format).dt.month

df_long['year'] = year
df_long['month'] = month
df_long['name'] = 'unitedstates'
df_long = df_long.drop(columns=['date'])

data_to_insert = df_long.to_dict('records')

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)

load_response = supabase.table('fact_housing')\
                        .insert(data_to_insert) \
                        .execute()
print(load_response)