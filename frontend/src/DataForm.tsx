import React, { useState } from 'react'
import { locationNames,locations } from './names';
// You would replace this with data fetched from your backend or a file


const months:{[key:number]:string} = {
  1:'January',2:'February',3:'March',4:'April', 5:'May',6:'June',7:'July',8:'August',9:'September',10:'October',11:'November',12:'December'
}



const DataForm = ({yearValue,setYearValue,monthValue,setMonthValue,setLocationId,locationData,displayIncome,setDisplayIncome,displayHousing,setDisplayHousing,displayAffordability,setDisplayAffordability}:
  {yearValue:number,setYearValue:(n:number)=>void,monthValue:number,setMonthValue:(n:number)=>void,setLocationId:(n:number)=>void,locationData:any,
    displayIncome:boolean,setDisplayIncome:(b:boolean)=>void,displayHousing:boolean,setDisplayHousing:(b:boolean)=>void,displayAffordability:boolean,setDisplayAffordability:(b:boolean)=>void}) => {
  // --- State to manage form inputs ---
  const [selectedState, setSelectedState] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Here you would send the data to your backend
    
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Housing Data Filter</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* --- 1. State Dropdown --- */}
        <div>
          <label htmlFor="state-select" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <select
            id="state-select"
            value={selectedState}
            onChange={(e) => {
              //otherwise leave displaying same 
              if(locations[e.target.value] != undefined){
                setLocationId(locations[e.target.value])
                setSelectedState(e.target.value)
              }
            }}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Please choose a state --</option>
            {locationNames.map((stateName) => (
              <option key={stateName} value={stateName}>
                {stateName}
              </option>
            ))}
          </select>
        </div>

        {/* --- 2. "Some Selectors" (Example: Radio Buttons) --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Property Type</label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                id="new-builds"
                type="checkbox"
                checked={displayIncome}
                onChange={(e) => setDisplayIncome(e.target.checked)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="new-builds" className="ml-3 block text-sm text-gray-800">
                Display Income
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="new-builds"
                type="checkbox"
                checked={displayHousing}
                onChange={(e) => setDisplayHousing(e.target.checked)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="new-builds" className="ml-3 block text-sm text-gray-800">
                Display Housing Price
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="new-builds"
                type="checkbox"
                checked={displayAffordability}
                onChange={(e) => setDisplayAffordability(e.target.checked)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="new-builds" className="ml-3 block text-sm text-gray-800">
                Display Housing Affordability
              </label>
            </div>

          </div>
        </div>
        
          <div>
            <div>
              <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Year: {yearValue + 2000}</label>
              <input id="default-range" min="0" max="24" onChange={(e) => setYearValue(Number(e.target.value))} type="range" value={yearValue} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
            </div>
            <div>
              <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Month: {months[monthValue]}</label>
              <input id="default-range" min="1" max="12" onChange={(e) => setMonthValue(Number(e.target.value))} type="range" value={monthValue} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
            </div>
        </div>
         
        
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataForm;