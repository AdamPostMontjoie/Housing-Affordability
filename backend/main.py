from supabase import create_client, Client
from fastapi import FastAPI
import os
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import datetime
#from dotenv import load_dotenv
import pandas
from prophet.serialize import model_from_json

allowed_origin_regex = r"^(https?://localhost:\d+|https://housing-affordability.*\.vercel\.app)$"

#load_dotenv()


#supabase
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

prophet_models = {}
#On startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Server starting up...")
    yield
    print("Server shutting down.")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=allowed_origin_regex,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

@app.get("/")
def read_root():
    return {"status": "Housing Affordability API is running!"}

@app.get("/location")
async def read_affordability(location_id: int):
    affordability_response = supabase.table('fact_affordability') \
                                    .select('affordability_value','price','income','year','month','name', 'five_year_rolling_income','five_year_rolling_price','five_year_volatility_income','five_year_volatility_price') \
                                    .eq('location_id',location_id) \
                                    .neq('year',2025) \
                                    .execute()
    return affordability_response.data

#gets the mortgage based on current data
@app.get('/fixed_mortgage')
async def fixed_mortgage(income:float,down_payment:int,loan_years:int):
    params_to_send = {
            'param_income':income,
            'param_down_payment':down_payment,
            'param_loan_years':loan_years
        }
    response = supabase.rpc('find_fixed_mortgage',params_to_send).execute()
    return response.data



#calculates down payment based on current payment + number of months passed
#pass starting year
@app.get('/predict_mortgage')
async def predict_mortgage(location_id:int, income:float,starting_down_payment:float,monthly_savings:float, mortgage_rate:float,loan_years:int):
    #  Safe Import inside function to prevent memory bloat on startup
    try:
        from prophet.serialize import model_from_json
    except ImportError:
        return {"error": "Prophet library not found."}

    #Check if we have the model. If not, fetch ONLY this one.
    if location_id not in prophet_models:
        print(f"Model {location_id} not in memory. Fetching...")
        try:
            response = supabase.storage.from_('prophet-models').download(f'model_{location_id}.json')
            prophet_models[location_id] = model_from_json(response.decode('utf-8')) 
        except Exception as e:
            print(f"Could not load model {location_id}: {e}")
            return {"error": f"Model {location_id} unavailable."}

    if mortgage_rate < 0: mortgage_rate = 0
    elif mortgage_rate > 100: mortgage_rate = 100
    if starting_down_payment < 0: starting_down_payment = 0
    if monthly_savings < 0: monthly_savings = 0
    
    starting_month = datetime.date.today().month - 10 + (datetime.date.today().year - 2025) * 12

    loc_model = prophet_models.get(location_id)
    future = loc_model.make_future_dataframe(periods=60 + starting_month + 1,freq="MS")
    future['rate'] = mortgage_rate 
    forecast = loc_model.predict(future)

    result = {
        'purchase-date':None,
        'price':None,
        'affordable':False,
        'monthly-payment':None,
        'forecast':None
    }

    lowest_payment = None
    tax_response = supabase.table('fact_property_tax').select('tax_rate').eq('location_id',location_id).execute()
    
    # Safety check if tax data is missing
    if tax_response.data:
        monthly_tax_rate = tax_response.data[0]['tax_rate'] / 100 / 12
    else:
        monthly_tax_rate = 0.01 / 12

    monthly_income = income / 12
    monthly_interest = mortgage_rate / 100 / 12
    n_payments = loan_years * 12

    current_date = pandas.to_datetime('today').normalize().replace(day=1)
    forecast = forecast.loc[forecast['ds'] >= current_date, ['ds', 'yhat']].copy().reset_index(drop=True)

    def calculate_payment(principal, home_price):
        if principal <= 0: 
            return (0.0, (home_price * monthly_tax_rate))
        if monthly_interest == 0:
            mortgage_payment = principal / n_payments
        else:
            mortgage_payment = principal * (
                (monthly_interest * pow(1 + monthly_interest, n_payments)) / 
                (pow(1 + monthly_interest, n_payments) - 1)
            )
        return (mortgage_payment, mortgage_payment + (home_price * monthly_tax_rate))

    for i in range( len(forecast)):
        prediction = forecast.iloc[i]
        down_payment = starting_down_payment + monthly_savings * (i)
        principal = prediction['yhat'] - down_payment
        mortgage =  calculate_payment(principal,prediction['yhat'])
        
        if mortgage[1] < (monthly_income * 0.33):
            if not result['affordable']:
                result['purchase-date'] = prediction['ds']
                result['price'] = prediction['yhat']
                result['affordable'] = True
                result['monthly-payment'] = mortgage[1]
            
            if result['affordable'] and (lowest_payment is None or mortgage[1] < lowest_payment):
                lowest_payment = mortgage[1]
                result['purchase-date'] = prediction['ds']
                result['price'] = prediction['yhat']
                result['monthly-payment'] = mortgage[1]

        elif not result['affordable'] and (lowest_payment is None or mortgage[1] < lowest_payment):
            lowest_payment = mortgage[1]
            result['purchase-date'] = prediction['ds']
            result['price'] = prediction['yhat']
            result['monthly-payment'] = mortgage[1]
        
    result['forecast'] = forecast.to_dict(orient='records')
    return result
