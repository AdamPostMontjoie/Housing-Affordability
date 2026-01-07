import {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';


interface State {
  locationId: number;
  yearValue: number;
  monthValue: number;
  displayIncome: boolean;
  displayHousing: boolean;
  displayReal: boolean;
  displayRollingAverage: boolean;
  displayVolatility: boolean;
  
  
  isLoading: boolean;
  locationData: any[] | undefined; 
}


type Action =
  | { type: 'SET_LOCATION_ID'; payload: number }
  | { type: 'SET_YEAR'; payload: number }
  | { type: 'SET_MONTH'; payload: number }
  | { type: 'TOGGLE_INCOME' }
  | { type: 'TOGGLE_HOUSING' }
  | { type: 'TOGGLE_REAL' }
  | { type: 'TOGGLE_ROLLING_AVERAGE' }
  | { type: 'TOGGLE_VOLATILITY' }
  // Actions for fetching data
  | { type: 'FETCH_DATA_START' }
  | { type: 'FETCH_DATA_SUCCESS'; payload: any[] }
  | { type: 'FETCH_DATA_ERROR' };

// The props for our provider component
interface DashboardProviderProps {
  children: ReactNode;
}

// The shape of the one context value we will provide
interface DashboardContextValue {
  state: State;
  dispatch: (action: Action) => void;
}


const DashboardContext = createContext<DashboardContextValue | undefined>(
  undefined
);


const initialState: State = {
  // UI Controls
  locationId: 0,
  yearValue: 24,
  monthValue: 12,
  displayIncome: true,
  displayHousing: true,
  displayReal: true,
  displayRollingAverage: false,
  displayVolatility: false,
  
  // Data
  isLoading: true,
  locationData: undefined,
};


function dashboardReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOCATION_ID':
      return { ...state, locationId: action.payload };
    case 'SET_YEAR':
      return { ...state, yearValue: action.payload };
    case 'SET_MONTH':
      return { ...state, monthValue: action.payload };
    case 'TOGGLE_INCOME':
      return { ...state, displayIncome: !state.displayIncome };
    case 'TOGGLE_HOUSING':
      return { ...state, displayHousing: !state.displayHousing };
    case 'TOGGLE_REAL':
      return { ...state, displayReal: !state.displayReal};
    case 'TOGGLE_ROLLING_AVERAGE':
      return { ...state, displayRollingAverage: !state.displayRollingAverage};
    case 'TOGGLE_VOLATILITY':
      return { ...state, displayVolatility: !state.displayVolatility};
    case 'FETCH_DATA_START':
      return { ...state, isLoading: true, locationData: undefined };
    case 'FETCH_DATA_SUCCESS':
      return { ...state, isLoading: false, locationData: action.payload };
    case 'FETCH_DATA_ERROR':
      return { ...state, isLoading: false, locationData: [] }; 

    default:
      throw new Error(`Unhandled action type`);
  }
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  // All state managed by useReducer
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // effect runs when the provider is first mounted
  useEffect(() => {
    async function getLocationData(id: number) {
    
      dispatch({ type: 'FETCH_DATA_START' });
      try {
        const api = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(`${api}/location?location_id=${id}`);
        
        dispatch({ type: 'FETCH_DATA_SUCCESS', payload: response.data });

      } catch (error) {
        console.error('Failed to fetch location data', error);
        
        dispatch({ type: 'FETCH_DATA_ERROR' });
      }
    }

    getLocationData(state.locationId);
  }, [state.locationId]); // Re-run this whole function when locationId changes


  const value = { state, dispatch };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}


export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}