import React, { useState } from 'react';
import axios from 'axios';

// --- Types ---
// This type defines the structure of a single state object
// returned from your API's `calculate_all_state_metrics` function.
type StateMetric = {
  state: string;
  avg_housing_price: number;
  monthly_mortgage_payment: number;
  monthly_payment_total: number;
  cost_of_loan: number;
  percent_annual_income: number;
  affordable: boolean;
  year: number;
  month: number;
};

// This type defines the full API response
type ApiResponse = {
  user_monthly_income: number;
  max_monthly_payment: number;
  affordable_states: StateMetric[];
  unaffordable_states: StateMetric[];
};

/**
 * A component to calculate housing affordability based on user inputs.
 */
const AffordabilityCalculator = () => {
  // --- State for Inputs ---
  const [income, setIncome] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [loanYears, setLoanYears] = useState('30'); // Default to 30 years

  // --- State for API Results ---
  const [results, setResults] = useState<ApiResponse | null>(null)
  const [affordableStates, setAffordableStates] = useState<StateMetric[]>([]);
  const [unaffordableStates, setUnaffordableStates] = useState<StateMetric[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the form submission.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Get the API URL from the environment (e.g., VITE_BACKEND_URL)
      const api = import.meta.env.VITE_BACKEND_URL;
      
      // Construct the query parameters

      // Call the API endpoint you designed
      const response = await axios.get(`${api}/fixed_mortgage?income=${income}&down_payment=${downPayment}&loan_years=${loanYears}`);
      setResults(response.data);
      const allStates = response.data || [];
      const affordable = allStates.filter((state:StateMetric) =>state.affordable == true)
      const unAffordable = allStates.filter((state:StateMetric) =>state.affordable == false)
      setAffordableStates(affordable)
      setUnaffordableStates(unAffordable)
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Function ---
  return (
    // Style: Using the same container style as DataForm.tsx
    <div className="p-8 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Affordability Calculator</h2>
      
      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 md:items-end">
          
          {/* Input: Income */}
          <div className="flex-1">
            <label htmlFor="income" className="block text-sm font-medium text-gray-700">Annual Income</label>
            <input
              id="income"
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="e.g., 120000"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Input: Down Payment */}
          <div className="flex-1">
            <label htmlFor="down_payment" className="block text-sm font-medium text-gray-700">Down Payment ($)</label>
            <input
              id="down_payment"
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              placeholder="e.g., 40000"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Input: Mortgage Term */}
          <div className="flex-1">
            <label htmlFor="loan_years" className="block text-sm font-medium text-gray-700">Mortgage Term</label>
            <select
              id="loan_years"
              value={loanYears}
              onChange={(e) => setLoanYears(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="30">30 Years</option>
              <option value="15">15 Years</option>
            </select>
          </div>

          {/* Button: Submit */}
          <div className="flex-shrink-0">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto p-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {isLoading ? 'Calculating...' : 'Submit'}
            </button>
          </div>
        </div>
      </form>

      {/* --- Results Section --- */}
      {error && (
        <div className="text-red-600 text-center p-4 border border-red-200 rounded-md bg-red-50">{error}</div>
      )}

      {results && (
        <div className="space-y-8">
          {/* Affordable List */}
          <ResultsList
            title="Affordable States"
            states={affordableStates}
          />
          <ResultsList
            title="Unaffordable States"
            states={unaffordableStates}
          />
        </div>
      )}
    </div>
  );
};


const ResultsList = ({ title, states }: { title: string, states: StateMetric[] }) => {
  

  let headers = states.length > 0 ? Object.keys(states[0]) : [];
  headers = headers.filter(h => h != "year" && h !="month")
  // Helper to format values for display
  const formatValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'number') {
      // Format percentages
      if (value > 0 && value < 1) {
        return (value * 100).toFixed(1) + '%';
      }
      // Format currency and other large numbers
      return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }
    return value;
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title} ({states.length})</h3>
      {states.length === 0 ? (
        <p className="text-gray-500">No states found in this category.</p>
      ) : (
        // Use a responsive table container
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {/* Just render the header name as-is from the API */}
                    {header.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {states.map((state, index) => (
                <tr key={index} className={state.affordable ? 'bg-green-50' : 'bg-red-50'}>
                  {headers.map((header) => (
                    <td
                      key={header}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                    >
                      {formatValue(state[header as keyof StateMetric])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AffordabilityCalculator;