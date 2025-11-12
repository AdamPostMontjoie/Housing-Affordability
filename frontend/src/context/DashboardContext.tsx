import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

// --- 1. Define Types ---

// The shape of all our state, (UI controls + data) in one object
interface State {
  locationId: number;
  yearValue: number;
  monthValue: number;
  displayIncome: boolean;
  displayHousing: boolean;
  displayReal: boolean;
  displayRollingAverage: boolean;
  displayVolatility: boolean;
  
  // We now include the data and loading state *inside* this object
  isLoading: boolean;
  locationData: any[] | undefined; // Using 'any' for simplicity
}

// All possible "letters" (actions) we can send
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

// --- 2. Create ONE Context ---
// This is the "bucket" our components will reach into.
const DashboardContext = createContext<DashboardContextValue | undefined>(
  undefined
);

// --- 3. Define Initial State ---
// This is the one "control panel" object.
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

// --- 4. Create the Reducer (The "Worker") ---
// This one function handles all state changes
function dashboardReducer(state: State, action: Action): State {
  switch (action.type) {
    // --- UI Control Actions ---
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
      return { ...state, displayReal: true, displayRollingAverage:false,displayVolatility:false};
    case 'TOGGLE_ROLLING_AVERAGE':
      return { ...state, displayRollingAverage:true,displayReal: false,displayVolatility:false};
    case 'TOGGLE_VOLATILITY':
      return { ...state, displayVolatility: true, displayRollingAverage:false,displayReal: false,};

    // --- Data Fetching Actions ---
    case 'FETCH_DATA_START':
      return { ...state, isLoading: true, locationData: undefined };
    case 'FETCH_DATA_SUCCESS':
      return { ...state, isLoading: false, locationData: action.payload };
    case 'FETCH_DATA_ERROR':
      return { ...state, isLoading: false, locationData: [] }; // Store empty array on error

    default:
      throw new Error(`Unhandled action type`);
  }
}

// --- 5. Create the Provider Component ---
// This component wraps your app.
export function DashboardProvider({ children }: DashboardProviderProps) {
  // All state is now managed by this single useReducer
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // This effect runs when the provider is first mounted
  // and whenever the 'locationId' in the state changes.
  useEffect(() => {
    async function getLocationData(id: number) {
      // Send a "letter" to the "mail slot" to tell the app we are loading
      dispatch({ type: 'FETCH_DATA_START' });
      try {
        const api = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(`${api}/location/?location_id=${id}`);
        console.log(response.data)
        // Send a "letter" with the data when we get it
        dispatch({ type: 'FETCH_DATA_SUCCESS', payload: response.data });

      } catch (error) {
        console.error('Failed to fetch location data', error);
        // Send an "error" letter
        dispatch({ type: 'FETCH_DATA_ERROR' });
      }
    }

    getLocationData(state.locationId);
  }, [state.locationId]); // Re-run this whole function when locationId changes

  // The value we provide is an object containing *both*
  // the current state and the dispatch function (the mail slot).
  const value = { state, dispatch };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// --- 6. Create ONE Custom Hook ---
// This is the only hook your other components will need to use.
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}