import { useEffect,useState } from 'react'
import axios from 'axios'

import Chart from './Chart'
import './index.css'
import DataForm from './DataForm'

function App() {
  const[locationData,setLocationData] = useState()
  //state controlled by control panel and prop drilled
  const[locationId,setLocationId] = useState(0)
  const [chartDisplay,setChartDisplay] = useState(0)
  const [yearValue, setYearValue] = useState(25);
  const [monthValue, setMonthValue] = useState(12);
  const [displayIncome, setDisplayIncome] = useState(true)
  const [displayHousing, setDisplayHousing] = useState(true)
  const [displayAffordability, setDisplayAffordability] = useState(true)

  //get data from backend once on page load, default as United States
  useEffect(()=>{
    async function getLocationData(locationId:number){
      try{
        console.log("tried")
        const response = await axios.get(`http://localhost:8000/location/?location_id=${locationId}`)
        //transform data into format for recharts first
        //chart will flip between displaying afforability, income, and housing price, and all 3
        
        setLocationData(response.data)
      } catch(error){
        console.log(error)
      }
    }
    getLocationData(locationId)
  },[locationId])

  return (
    <div className="flex flex-row p-8 space-x-8 min-h-screen bg-gray-100">
      <div className="w-1/3">
        <DataForm 
          yearValue={yearValue} 
          setYearValue={setYearValue} 
          monthValue={monthValue} 
          setMonthValue={setMonthValue} 
          setLocationId={setLocationId}
          locationData={locationData}
          displayIncome={displayIncome}
          setDisplayIncome={setDisplayIncome}
          displayHousing={displayHousing}
          setDisplayHousing={setDisplayHousing}
          displayAffordability={displayAffordability}
          setDisplayAffordability={setDisplayAffordability}
        />
      </div>
      <div className="flex-1">
        <Chart/>
      </div>

    </div>
  )
}

export default App