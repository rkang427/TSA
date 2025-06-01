import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const CityDemographicsChart = ({ demograph }) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!demograph.length || !canvasRef.current) return;

    const city_dct = {};
    demograph.forEach(item => {
      city_dct[item['City']] = (city_dct[item['City']] || 0) + 1;
    });

    const cityLabels = Object.keys(city_dct).filter(c => c !== 'Unknown');
    const cityData = cityLabels.map(label => city_dct[label]);

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: cityLabels,
        datasets: [{
          label: 'Student Count',
          data: cityData,
          backgroundColor: '#6e2c6f',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Student Demographics by City' }
        }
      }
    });
  }, [demograph]);

  return (
      <div className="graphTitle" style={{width: '100%', padding: '1rem', border: '3px solid rgb(201, 176, 22)'}}>
        <h3>Student Demographics by City</h3>
        <canvas ref={canvasRef} width="300" height="300"/>
      </div>
  );
};

export default CityDemographicsChart;
