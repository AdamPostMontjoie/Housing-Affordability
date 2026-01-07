import { useState } from 'react'
import './index.css'
import Navbar from './Navbar'

// View 1 Components
import AffordabilityCalculator from './MortgageForm'

// View 2 Components
import Chart from './Chart'
import DataForm from './DataForm'

// View 3 Components 
import PredictForm from './PredictForm'
import PredictChart from './PredictChart'
import { PredictProvider } from './context/PredictContext'

function App() {

  // State handles 3 views: 'calculator', 'dashboard', 'prediction'
  const [view, setView] = useState('prediction')

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
   
      <Navbar view={view} setView={setView}/>

      
      {view === 'prediction' && (
        <PredictProvider>
          <main className="flex-1 flex flex-row p-8 space-x-8">
            <div className="w-1/3">
              <PredictForm />
            </div>
            <div className="flex-1">
              <PredictChart />
            </div>
          </main>
        </PredictProvider>
      )}
      
     
      {view === 'calculator' && (
         <main className="flex-1 flex flex-row p-8 space-x-8">
           <AffordabilityCalculator/>
         </main>
      )}

      
      {view === 'dashboard' && (
        <main className="flex-1 flex flex-row p-8 space-x-8">
          <div className="w-1/3">
            <DataForm />
          </div>
          <div className="flex-1">
            <Chart />
          </div>
        </main>
      )}

      
      
    </div>
  )
}

export default App