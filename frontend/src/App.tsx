import { useState } from 'react'
import Chart from './Chart'
import './index.css'
import DataForm from './DataForm'
import AffordabilityCalculator from './MortgageForm'
import Navbar from './Navbar'

function App() {

  //toggles between mortgage calculator and dashboard
  const [toggle, setToggle] = useState(false)


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      
      {/* 2. Navbar sits at the top */}
      <Navbar toggle={toggle} setToggle={setToggle}/>
      { toggle && (
        <main className="flex-1 flex flex-row p-8 space-x-8">
        <div className="w-1/3">
          <DataForm />
        </div>
        <div className="flex-1">
          <Chart />
        </div>
      </main>
      )}
      {!toggle && (
         <main className="flex-1 flex flex-row p-8 space-x-8">
        <AffordabilityCalculator/>
      </main>
      )}
      
      
    </div>
  )
}

export default App