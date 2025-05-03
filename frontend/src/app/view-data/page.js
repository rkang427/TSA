"use client";
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { useRouter } from 'next/navigation';
const Page = () => {
  const [demograph, setDemograph] = useState([]);
  const router = useRouter();
  useEffect(() => {
    fetch('/student_demographics.csv')
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setDemograph(results.data);
          },
        });
      })
      .catch((error) => {
        console.error('Error fetching CSV file:', error);  // Handle any errors
      });
  }, []);
  return (
    <div>
        <div className="centerTitle">
            <h1>Data from Student Demographics</h1>
            <div style={{textAlign: 'right'}}>
                <button className="dataButton" onClick={() => router.push('/')}>Home</button>
            </div>
        </div>
        {demograph.length === 0 ? (
            <div className="center"><p>Loading the data ... Thank you for your patience! </p></div>
            ) : (

          <table>

              <thead>
              <tr>
                  {Object.keys(demograph[0]).map((key) => (
                      <th key={key}>{key}</th>
                  ))}
              </tr>
              </thead>
              <tbody>
              {demograph.map((row, index) => (
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

export default Page;
