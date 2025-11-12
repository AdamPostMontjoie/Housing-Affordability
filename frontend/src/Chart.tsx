
import React, { useState } from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';
import { useDashboard } from './context/DashboardContext';


const Chart = () => {

    const {state} = useDashboard();
    const formattedData = React.useMemo(() => {
    let locationData = state.locationData
    if (!locationData) return [];
    return locationData.map((d:any) => ({
      ...d,
      price: (d.price !== null && d.price !== undefined) ? parseFloat(d.price.toFixed(2)) : null,
      date: `${d.year}-${String(d.month).padStart(2, '0')}`
    }));
  }, [state.locationData]);

  const formatXAxis = (tickItem: string) => {
    // tickItem will be "2020-01", "2020-02", etc.
    const month = tickItem.substring(5, 7);

    // 3. Only return a label if it's January (the first month of the year)
    if (month === '01') {
      return tickItem.substring(0, 4); // Return "2020"
    }
    return ''; // Return an empty string for all other months
  };
  return (
    <div>
      <LineChart
        style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
        responsive
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
        <YAxis width="auto" />
        <Tooltip/>
        <Legend />
        {state.displayIncome&& state.displayReal && (
            <Line type="monotone" dot={false} dataKey="income" stroke="#8884d8"  />
        )}
        {state.displayHousing && state.displayReal && (
            <Line type="monotone" dot={false} dataKey="price" stroke="#82ca9d" />
        )}
        {state.displayIncome&& state.displayRollingAverage && (
            <Line type="monotone" dot={false} dataKey="five_year_rolling_income" stroke="#8884d8"  />
        )}
        {state.displayHousing && state.displayRollingAverage && (
            <Line type="monotone" dot={false} dataKey="five_year_rolling_price" stroke="#82ca9d" />
        )}
        
        
      </LineChart>
    </div>
  )
}
export default Chart

