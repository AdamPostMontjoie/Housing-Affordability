import { useEffect,useState } from 'react'
import axios from 'axios'
import Chart from './Chart'
import './index.css'
import DataForm from './DataForm'

function App() {


  //get data from backend once on page load, default as United States
  

  //onchange of location, year, or month fetch proper data


  return (
    <div className="flex flex-row p-8 space-x-8 min-h-screen bg-gray-100">
      <div className="w-1/3">
        <DataForm />
      </div>
      <div className="flex-1">
        <Chart />
      </div>
    </div>
  )
}

export default App