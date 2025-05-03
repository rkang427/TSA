"use client";
import React, { useRef, useEffect, useState } from 'react';
import Papa from 'papaparse';
import Chart from 'chart.js/auto';
import { useRouter } from 'next/navigation';

const Home = () => {
  const [demograph, setDemograph] = useState([]);
  const chartInstanceRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/student_demographics.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setDemograph(results.data);
          }
        });
      })
      .catch(error => console.error('Error fetching CSV file:', error));
  }, []);

  // Render chart after demograph state is set
  useEffect(() => {
    if (!demograph.length) return;

    const city_dct = {};
    demograph.forEach(item => {
      city_dct[item['City']] = (city_dct[item['City']] || 0) + 1;
    });

    let cityLabels = Object.keys(city_dct);
    let cityData = Object.values(city_dct);

    const unknownIndex = cityLabels.indexOf('Unknown');
    if (unknownIndex !== -1) {
      cityLabels.splice(unknownIndex, 1);
      cityData.splice(unknownIndex, 1);
    }

    const ctx = document.getElementById('myChart').getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: cityLabels,
        datasets: [{
          label: 'Student Count',
          data: cityData,
          backgroundColor: '#6e2c6f',
          borderColor: '#6e2c6f',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Student Demographics Chart'
          }
        }
      }
    });
  }, [demograph]);

  return (
    <div>
      <div className="centerTitle"><h1>The Scholarship Academy - Key Insights for 2025</h1></div>
      <canvas id="myChart" width="400" height="200"></canvas>
      <button className="dataButton" onClick={() => router.push('/view-data')}>View Data</button>
    </div>
  );
};

export default Home;
