import { useEffect,useState } from 'react'
import axios from 'axios'
import Chart from './Chart'
import './index.css'
import DataForm from './DataForm'

function App() {
  const[locationData,setLocationData] = useState()
  //state controlled by control panel and prop drilled
  const[locationId,setLocationId] = useState(0)
  const [yearValue, setYearValue] = useState(24);
  const [monthValue, setMonthValue] = useState(12);
  const [displayIncome, setDisplayIncome] = useState(true)
  const [displayHousing, setDisplayHousing] = useState(true)

  //get data from backend once on page load, default as United States
  useEffect(()=>{
    async function getLocationData(locationId:number){
      try{
        console.log("tried")
        const api = import.meta.env.VITE_BACKEND_URL
        const response = await axios.get(`${api}/location/?location_id=${locationId}`)
        //transform data into format for recharts first
        //chart will flip between displaying afforability, income, and housing price, and all 3
        console.log(response.data)
        setLocationData(response.data)
      } catch(error){
        console.log(error)
      }
    }
    getLocationData(locationId)
  },[locationId])

  //onchange of location, year, or month fetch proper data


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
        />
      </div>
      <div className="flex-1">
        <Chart locationData={locationData} displayIncome={displayIncome} displayHousing={displayHousing}/>
      </div>
    </div>
  )
}

export default App