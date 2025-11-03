import React, { useState, useEffect } from 'react'
import { locationNames,locations,months} from './names';
import InfoModal from './InfoModal';
// You would replace this with data fetched from your backend or a file



const DataForm = ({yearValue,setYearValue,monthValue,setMonthValue,setLocationId,locationData,displayIncome,setDisplayIncome,displayHousing,setDisplayHousing,displayAffordability,setDisplayAffordability}:
  {yearValue:number,setYearValue:(n:number)=>void,monthValue:number,setMonthValue:(n:number)=>void,setLocationId:(n:number)=>void,locationData:any,
    displayIncome:boolean,setDisplayIncome:(b:boolean)=>void,displayHousing:boolean,setDisplayHousing:(b:boolean)=>void,displayAffordability:boolean,setDisplayAffordability:(b:boolean)=>void}) => {
  // --- State to manage form inputs ---
  const [selectedState, setSelectedState] = useState('');
  const [dataOnDate,setDataOnDate] = useState<any>()
  const [affordable, setAffordable] = useState<String>("")
  const [isModalOpen,setIsModalOpen] = useState(false)
  //display value on date
  useEffect(()=>{
    function onDate(){
      if(locationData){
        const data = locationData.find((obj:any) => obj.year == (yearValue +2000) && (obj.month == monthValue))
        console.log(data)
        setDataOnDate(data)
        if(data.affordability_value != null){
          if(data.affordability_value < 3){
            setAffordable("Highly Affordable")
          } else if(data.affordability_value >= 3 && data.affordability_value <= 5){
            setAffordable("Affordable")
          } else if(data.affordability_value <= 7){
            setAffordable("Unaffordable")
          } else {
            setAffordable("Highly Unaffordable")
          }
        } else {
          setAffordable("Not Enough Data")
        }
      }
    }
    onDate()
  },[yearValue,monthValue,locationData])
  const getAffordabilityColor = () => {
    switch (affordable) {
      case "Highly Affordable":
      case "Affordable":
        return "text-green-600";
      case "Unaffordable":
      case "Highly Unaffordable":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-md">
      <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Housing Affordability</h2>
        {/* 5. Add a button to open the modal */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="text-sm text-blue-600 hover:underline"
        >
          About The Data
        </button>
      </div>
      <form className="space-y-6">
        
        {/* State Dropdown  */}
        <div>
          <label htmlFor="state-select" className="block text-sm font-medium text-gray-700">
            Location
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
            
            {locationNames.map((stateName) => (
              <option key={stateName} value={stateName}>
                {stateName}
              </option>
            ))}
          </select>
        </div>
        {/* Date selection */}
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
            {/* Displayed data */}
            <div className="text-center p-4 mb-6 border rounded-lg">
              <h3 className={`text-3xl font-bold ${getAffordabilityColor()}`}>
                {affordable}
              </h3>
            </div>
          {dataOnDate &&  (
            <div>

              {dataOnDate.affordability_value != null ? (
                <div>
                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Median Household Income: ${dataOnDate.income}</label>
                </div>
              ): (
                <div>
                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Median Household Income: No Data</label>
                </div>
              )}
              {dataOnDate.affordability_value != null ? (
                <div>
                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Zillow Housing Price: ${dataOnDate.price.toFixed(2)}</label>
                </div>
              ): (
                <div>
                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Zillow Housing Price: No Data</label>
                </div>
              )}
              {dataOnDate.affordability_value != null ? (
                <div>
                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Affordability: {dataOnDate.affordability_value.toFixed(2)}</label>
                </div>
              ): (
                <div>
                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Affordability: Not Enough Data</label>
                </div>
              )}
              
            </div>
          )}
        {/* pick categories displayed */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Chart Values</label>
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

            

          </div>
        </div>
        
            
         
        
      </form>
    </div>
  );
};

export default DataForm;