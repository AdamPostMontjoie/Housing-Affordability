
// Define the props the modal will accept


const InfoModal = ({ isOpen, onClose }:{isOpen:boolean,onClose:()=>void}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose} 
    >
      <div
        className="relative w-full max-w-lg p-8 mx-4 bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">About The Data</h2>
        <div className="space-y-4 text-sm text-gray-700">
    
          <p>
            The data for the real median household income was taken from the Federal Reserve Economic Data (FRED) distributed by the Federal Reserve Bank of St. Louis.
          </p>
          <p>
            The data for the housing prices was taken from the Zillow Home Value Index (ZHVI) created by Zillow Research.
          </p>
         <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How is affordability calculated?</h3>
            <p>
              The old school recommendation is that a house costs between 3 to 5 times your yearly income.
            </p>
            <p className="mt-2">
              To calculate the affordability at a time, I compared the home value in an area with the median household income (Price / Income).
            </p>
          </div>
         

          {/* links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Links</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><a href="https://fred.stlouisfed.org/release/tables?rid=249&eid=259515#snid=259516" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">FRED Median Household Income</a></li>
              <li><a href="https://www.zillow.com/research/data/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Zillow Home Value Index</a></li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Links</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><a href="https://github.com/AdamPostMontjoie" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">My GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/adampostmontjoie" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">My LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={onClose}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;