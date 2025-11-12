import React from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';
import { useDashboard } from './context/DashboardContext';


const Chart = () => {

    const {state} = useDashboard();
    const formattedData = React.useMemo(() => {
    let locationData = state.locationData
    if (!locationData) return [];
    
    // Convert data to numbers and format it for the chart
    return locationData.map((d:any) => ({
      ...d,
      housing_price: (d.price !== null && d.price !== undefined) ? parseFloat(d.price.toFixed(2)) : null,
      date: `${d.year}-${String(d.month).padStart(2, '0')}`,
      
      rolling_average_income: (d.five_year_rolling_income !== null && d.five_year_rolling_income !== undefined) 
        ? parseFloat(d.five_year_rolling_income.toFixed(2)) 
        : null,
      income_volatility: (d.five_year_volatility_income !== null && d.five_year_volatility_income !== undefined) 
        ? parseFloat(d.five_year_volatility_income.toFixed(2)) 
        : null,
      rolling_average_housing_price: (d.five_year_rolling_price !== null && d.five_year_rolling_price !== undefined) 
        ? parseFloat(d.five_year_rolling_price.toFixed(2)) 
        : null,
      housing_volatility: (d.five_year_volatility_price !== null && d.five_year_volatility_price !== undefined) 
        ? parseFloat(d.five_year_volatility_price.toFixed(2)) 
        : null,
    }));
  }, [state.locationData]);

  const formatXAxis = (tickItem: string) => {
    const month = tickItem.substring(5, 7);

    if (month === '01') {
      return tickItem.substring(0, 4);
    }
    return '';
  };
  return (
    <div>
      <LineChart
        style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
        data={formattedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis interval={23} dataKey="date" tickFormatter={formatXAxis}/>
        <YAxis 
          width={80} // Give Y-axis a bit more space
          tickFormatter={(value) => `$${new Intl.NumberFormat('en-US').format(value)}`} // Format ticks as currency
        />
        <Tooltip formatter={(value: number) => `$${new Intl.NumberFormat('en-US').format(value)}`} />
        <Legend />

  
        {state.displayIncome && state.displayReal && (
            <Line type="monotone" dot={false} dataKey="income" name="Income (Real)" stroke="#8884d8"  />
        )}
        {state.displayHousing && state.displayReal && (
            <Line type="monotone" dot={false} dataKey="housing_price" name="Housing Price (Real)" stroke="#82ca9d" />
        )}

        {state.displayIncome && state.displayRollingAverage && (
            <Line type="monotone" dot={false} dataKey="rolling_average_income" name="Income (Rolling Avg)" stroke="#ffc658"  />
        )}
        {state.displayHousing && state.displayRollingAverage && (
            <Line type="monotone" dot={false} dataKey="rolling_average_housing_price" name="Housing (Rolling Avg)" stroke="#ff7300" />
        )}

        {state.displayIncome && state.displayVolatility && (
            <Line type="monotone" dot={false} dataKey="income_volatility" name="Income (Volatility)" stroke="#3498db"  />
        )}
        {state.displayHousing && state.displayVolatility && (
            <Line type="monotone" dot={false} dataKey="housing_volatility" name="Housing (Volatility)" stroke="#e74c3c" />
        )}
        
        
      </LineChart>
    </div>
  )
}
export default Chart