import React, { useState } from 'react';
import { locationNames, locations } from './names';
import { usePredict } from './context/PredictContext';
import PredictionModal from './PredictionModal';

const PredictForm = () => {
  const { state, dispatch, fetchPrediction } = usePredict();
  const [isModalOpen,setIsModalOpen] = useState(false)
  const [selectedState, setSelectedState] = useState('United States');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrediction();
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-md">
        <PredictionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Plan My Purchase</h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="text-sm text-blue-600 hover:underline"
        >
          About The Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Location Dropdown */}
        <div>
          <label htmlFor="state-select" className="block text-sm font-medium text-gray-700">
            Target Location
          </label>
          <select
            id="state-select"
            value={selectedState}
            onChange={(e) => {
               if(locations[e.target.value] !== undefined){
                dispatch({type:'SET_LOCATION_ID', payload:locations[e.target.value]})
                setSelectedState(e.target.value)
              }
            }}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {locationNames.map((stateName) => (
              <option key={stateName} value={stateName}>
                {stateName}
              </option>
            ))}
          </select>
        </div>

        {/* Annual Income */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Annual Income (Take Home)</label>
          <input
            type="number"
            value={state.income}
            onChange={(e) => dispatch({ type: 'SET_INCOME', payload: Number(e.target.value) })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Current Down Payment */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Saved Down Payment ($)</label>
          <input
            type="number"
            value={state.startingDownPayment}
            onChange={(e) => dispatch({ type: 'SET_DOWN_PAYMENT', payload: Number(e.target.value) })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Monthly Savings */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Savings Contribution ($)</label>
          <input
            type="number"
            value={state.monthlySavings}
            onChange={(e) => dispatch({ type: 'SET_MONTHLY_SAVINGS', payload: Number(e.target.value) })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Mortgage Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Estimated Mortgage Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={state.mortgageRate}
            onChange={(e) => dispatch({ type: 'SET_MORTGAGE_RATE', payload: Number(e.target.value) })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Loan Term */}
         <div>
          <label className="block text-sm font-medium text-gray-700">Loan Term (Years)</label>
          <select
            value={state.loanYears}
            onChange={(e) => dispatch({ type: 'SET_LOAN_YEARS', payload: Number(e.target.value) })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="30">30 Years</option>
            <option value="20">20 Years</option>
            <option value="15">15 Years</option>
            <option value="10">10 Years</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={state.isLoading}
          className="w-full p-3 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-gray-400 font-bold"
        >
          {state.isLoading ? 'Calculating...' : 'Run Prediction'}
        </button>
      </form>
    </div>
  );
};

export default PredictForm;