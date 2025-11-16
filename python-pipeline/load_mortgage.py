import pandas as pd
import sys
import os
from supabase import Client, create_client
import argparse
from dotenv import load_dotenv
import numpy as np

load_dotenv()

parser = argparse.ArgumentParser(description="Load mortgage data from CSV")

parser.add_argument("-f","--file",
                    help="Path to CSV file",
                    required=True)
args = parser.parse_args()

filepath = args.file
filename = os.path.basename(filepath)

try:
    df_raw_mortgage = pd.read_csv(filepath)
except Exception as e:
    print(f"Error reading CSV: {e}")
    sys.exit(1)


df_raw_mortgage['source_file'] = filename
date_format = "%m/%d/%y"
df_raw_mortgage['date'] = pd.to_datetime(df_raw_mortgage['date'],format=date_format)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)



df_fact = pd.DataFrame()

year = pd.to_datetime(df_raw_mortgage['date'], format=date_format).dt.year
month = pd.to_datetime(df_raw_mortgage['date'], format=date_format).dt.month
df_fact['month'] = month;
df_fact['year'] = year
df_fact['rate'] = df_raw_mortgage['rate']
df_fact = df_fact.groupby(['year','month'])['rate'].mean().reset_index()

formatted_data_to_insert = df_fact.to_dict('records')

#change to string for insertion compatability
df_raw_mortgage['date'] = df_raw_mortgage['date'].astype(str)
raw_data_to_insert = df_raw_mortgage.to_dict('records')

#insert raw data
try:
     supabase.table("raw_mortgage").insert(raw_data_to_insert).execute()
except Exception as e:
   print(e)


#insert formatted data
try:
     supabase.table("fact_mortgage").insert(formatted_data_to_insert).execute()
except Exception as e:
   print(e)


