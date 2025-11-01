from typing import Union
from supabase import create_client, Client
from fastapi import FastAPI
import os
from dotenv import load_dotenv 
import pandas as pd

app = FastAPI()

load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@app.get("/location")
async def read_affordability(location_id: int):
    affordability_response = supabase.table('fact_affordability') \
                                    .select('affordability_value','price','income','year','month','name') \
                                    .eq('location_id',location_id) \
                                    .execute()
    return affordability_response.data