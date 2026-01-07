
// Define the props the modal will accept


const PredictionModal = ({ isOpen, onClose }:{isOpen:boolean,onClose:()=>void}) => {
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
            Predictions are done by 52 Meta Prophet models trained on the Zillow Home Value Index created by Zillow Research, with historical mortgage rate data distributed by the Federal Reserve Bank of St. Louis used as a regressor.
          </p>
          <p>
            The models predict how prices will rise in a region of the US, using the mortgage rate to help the models determine market trends.
          </p>
         
         

          {/* links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">The Data</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><a href="https://fred.stlouisfed.org/series/MORTGAGE30US" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">FRED US Mortgage Average</a></li>
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

export default PredictionModal;