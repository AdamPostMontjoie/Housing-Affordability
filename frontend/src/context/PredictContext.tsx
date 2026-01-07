import {
  createContext,
  useContext,
  useReducer,
} from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';


interface PredictionResult {
  'purchase-date': string | null;
  'price': number | null;
  'affordable': boolean;
  'monthly-payment': number | null;
  'earliest-date':string|null
  'forecast': Array<{ ds: string; yhat: number }>;
}

interface State {
  // Inputs
  locationId: number;
  income: number;
  startingDownPayment: number;
  monthlySavings: number;
  mortgageRate: number;
  loanYears: number;

  // Data
  isLoading: boolean;
  predictionData: PredictionResult | null;
  error: string | null;
}

type Action =
  | { type: 'SET_LOCATION_ID'; payload: number }
  | { type: 'SET_INCOME'; payload: number }
  | { type: 'SET_DOWN_PAYMENT'; payload: number }
  | { type: 'SET_MONTHLY_SAVINGS'; payload: number }
  | { type: 'SET_MORTGAGE_RATE'; payload: number }
  | { type: 'SET_LOAN_YEARS'; payload: number }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: PredictionResult }
  | { type: 'FETCH_ERROR'; payload: string };

interface PredictProviderProps {
  children: ReactNode;
}

interface PredictContextValue {
  state: State;
  dispatch: (action: Action) => void;
  fetchPrediction: () => Promise<void>;
}

const PredictContext = createContext<PredictContextValue | undefined>(undefined);

const initialState: State = {
  locationId: 0, // Default to United States or similar
  income: 60000,
  startingDownPayment: 10000,
  monthlySavings: 500,
  mortgageRate: 6.5,
  loanYears: 30,

  isLoading: false,
  predictionData: null,
  error: null,
};

function predictReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOCATION_ID':
      return { ...state, locationId: action.payload };
    case 'SET_INCOME':
      return { ...state, income: action.payload };
    case 'SET_DOWN_PAYMENT':
      return { ...state, startingDownPayment: action.payload };
    case 'SET_MONTHLY_SAVINGS':
      return { ...state, monthlySavings: action.payload };
    case 'SET_MORTGAGE_RATE':
      return { ...state, mortgageRate: action.payload };
    case 'SET_LOAN_YEARS':
      return { ...state, loanYears: action.payload };
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null, predictionData: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, predictionData: action.payload };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error(`Unhandled action type`);
  }
}

export function PredictProvider({ children }: PredictProviderProps) {
  const [state, dispatch] = useReducer(predictReducer, initialState);

  
  async function fetchPrediction() {
    dispatch({ type: 'FETCH_START' });
    try {
      const api = import.meta.env.VITE_BACKEND_URL;
      const { locationId, income, startingDownPayment, monthlySavings, mortgageRate, loanYears } = state;
      
      const response = await axios.get(`${api}/predict_mortgage`, {
        params: {
          location_id: locationId,
          income: income,
          starting_down_payment: startingDownPayment,
          monthly_savings: monthlySavings,
          mortgage_rate: mortgageRate,
          loan_years: loanYears
        }
      });
      console.log(response)
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });

    } catch (error) {
      console.error('Failed to fetch prediction', error);
      dispatch({ type: 'FETCH_ERROR', payload: 'Failed to calculate prediction.' });
    }
  }

  const value = { state, dispatch, fetchPrediction };

  return (
    <PredictContext.Provider value={value}>
      {children}
    </PredictContext.Provider>
  );
}

export function usePredict() {
  const context = useContext(PredictContext);
  if (context === undefined) {
    throw new Error('usePredict must be used within a PredictProvider');
  }
  return context;
}