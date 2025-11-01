
import MarkerTemplateMaps from './components/map'
import Navbar from './components/navbar'

import './index.css'
function App() {

  return (
    <div className="w-full min-h-screen bg-gray-100 overflow-x-hidden">
      <Navbar/>

        <div >
          <MarkerTemplateMaps/>
        </div>
    </div>
  )
}

export default App
