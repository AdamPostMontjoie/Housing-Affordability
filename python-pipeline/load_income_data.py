import pandas as pd
import os
import argparse
from supabase import Client, create_client
from dotenv import load_dotenv

#load env
load_dotenv()

#command line file arguments
parser = argparse.ArgumentParser(description="Load income data from a CSV.")
parser.add_argument("-f", "--file", 
                    help="Path to the input CSV file", 
                    required=True)
parser.add_argument("-id", "--location_id", 
                    help="The id of the state", #0 for usa, 1-50 for states in order of joining union 51 for DC
                    required=True)

args = parser.parse_args()

filepath = args.file
location_id = args.location_id
filename = os.path.basename(filepath)

#setup csv as dataframe
try:
    income_data = pd.read_csv(filepath,names=["observation_date","income"],header=0)
    income_data['source_file'] = filename
    income_data['location_id'] = location_id
    print(income_data)
except Exception as e:
    print(f"error {e}")


url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)

# 2. Convert the DataFrame to a list of dictionaries
data_to_insert = income_data.to_dict('records')

#Insert raw data
try:
    load_response = supabase.table("raw_income_data").insert(data_to_insert).execute()
except Exception as e:
    print(f"Error inserting data: {e}")