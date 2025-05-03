"use client";
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Chart from 'chart.js/auto';

const MyChart = () => {
  const [csvData1, setCsvData1] = useState([]);
  const [csvData2, setCsvData2] = useState([]);

  useEffect(() => {
    fetch('/student_demographics.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setCsvData1(results.data);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching CSV file:', error);
      });

    fetch('/semantics.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setCsvData2(results.data);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching second CSV file:', error);
      });

  }, []);  // This effect runs only once after the initial render

  return (
    <div>
      <h1>CSV Data from Multiple Files</h1>
      <h2>Data from Student Demographics</h2>
      {csvData1.length === 0 ? (
        <p>Loading data...</p>
      ) : (
        <table>
          <thead>
            <tr>
              {Object.keys(csvData1[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData1.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Display Data from CSV 2 */}
      <h2>Data from Another CSV File</h2>
      {csvData2.length === 0 ? (
        <p>Loading data...</p>
      ) : (
        <table>
          <thead>
            <tr>
              {Object.keys(csvData2[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData2.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyChart;
