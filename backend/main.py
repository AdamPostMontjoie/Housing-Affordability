from typing import Union
from supabase import create_client, Client
from fastapi import FastAPI
import os
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import re

app = FastAPI()
allowed_origin_regex = r"^(https?://localhost:\d+|https://housing-affordability.*\.vercel\.app)$"



app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=allowed_origin_regex,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)
#supabase
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@app.get("/")
def read_root():
    return {"status": "Housing Affordability API is running!"}

@app.get("/location")
async def read_affordability(location_id: int):
    affordability_response = supabase.table('fact_affordability') \
                                    .select('affordability_value','price','income','year','month','name') \
                                    .eq('location_id',location_id) \
                                    .neq('year',2025) \
                                    .execute()
    return affordability_response.data