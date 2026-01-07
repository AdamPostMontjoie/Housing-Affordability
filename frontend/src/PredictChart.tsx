import React from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ReferenceLine } from 'recharts';
import { usePredict } from './context/PredictContext';

const PredictChart = () => {
  const { state } = usePredict();
  const { predictionData } = state;

  const formattedData = React.useMemo(() => {
    if (!predictionData || !predictionData.forecast) return [];
    
    // Map the forecast data for Recharts
    return predictionData.forecast.map((d: any) => ({
      date: new Date(d.ds).toISOString().split('T')[0], // Format YYYY-MM-DD
      predicted_price: d.yhat ? parseFloat(d.yhat.toFixed(2)) : null,
    }));
  }, [predictionData]);

  const formatXAxis = (tickItem: string) => {
    // Show only Year for clarity on long timeline
    return tickItem.substring(0, 4);
  };

  if (!predictionData) {
    return (
        <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg p-12">
            <p className="text-gray-500 text-lg">Enter your savings plan to see when you can afford a home!</p>
        </div>
    );
  }

  // Determine status color and text
  let statusColor = "text-gray-500";
  let statusText = "Calculating...";
  
  if (predictionData.affordable) {
    statusColor = "text-green-600";
    if(predictionData['earliest-date'] == predictionData['purchase-date']){
        statusText = `You can afford a home on ${new Date(predictionData['purchase-date']!).toLocaleDateString()}!`;
    } else {
        statusText = `You can afford a home on ${new Date(predictionData['earliest-date']!).toLocaleDateString()}, but should wait until  ${new Date(predictionData['purchase-date']!).toLocaleDateString()} to buy`;
    }
  } else {
    statusColor = "text-red-600";
    statusText = "Based on this plan, a home remains unaffordable in the next 5 years.";
  }

  return (
    <div>
        <div className="mb-4 text-center">
            <h3 className={`text-2xl font-bold ${statusColor}`}>{statusText}</h3>
            {predictionData.affordable && (
                 <p className="text-gray-700 mt-2">
                    Est. Price: <b>${new Intl.NumberFormat('en-US').format(predictionData.price!)}</b> | 
                    Est. Monthly Payment: <b>${new Intl.NumberFormat('en-US').format(predictionData['monthly-payment']!)}</b>
                 </p>
            )}
        </div>

      <LineChart
        style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
        data={formattedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={formatXAxis} minTickGap={50} />
        <YAxis 
          width={80} 
          tickFormatter={(value) => `$${new Intl.NumberFormat('en-US').format(value)}`} 
          domain={['auto', 'auto']}
        />
        <Tooltip formatter={(value: number) => `$${new Intl.NumberFormat('en-US').format(value)}`} />
        <Legend />

        <Line 
            type="monotone" 
            dot={false} 
            dataKey="predicted_price" 
            name="Forecasted Home Price" 
            stroke="#8884d8" 
            strokeWidth={2}
        />
        
        {/* Draw a vertical line at the purchase date if affordable */}
        {predictionData.affordable && predictionData['purchase-date'] && (
            <ReferenceLine x={new Date(predictionData['purchase-date']).toISOString().split('T')[0]} stroke="green" />
        )}

      </LineChart>
    </div>
  )
}
export default PredictChart;