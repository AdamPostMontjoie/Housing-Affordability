from typing import Union
from supabase import create_client, Client
from fastapi import FastAPI
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

#cors
origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "https://housing-affordability.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)
#supabase
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@app.get("/location")
async def read_affordability(location_id: int):
    affordability_response = supabase.table('fact_affordability') \
                                    .select('affordability_value','price','income','year','month','name') \
                                    .eq('location_id',location_id) \
                                    .neq('year',2025) \
                                    .execute()
    return affordability_response.data