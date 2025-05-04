"use client";
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [demograph, setDemograph] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
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
            setFilteredData(results.data);
          },
        });
      })
      .catch((error) => {
        console.error('Error fetching CSV file:', error);
      });
  }, []);

  const handleFilterChange = (column, value) => {
    const newFilters = {
      ...filters,
      [column]: value.toLowerCase(),
    };
    setFilters(newFilters);

    const filtered = demograph.filter((row) =>
      Object.entries(newFilters).every(([key, val]) =>
        row[key]?.toLowerCase().includes(val)
      )
    );
    setFilteredData(filtered);
  };

  if (demograph.length === 0) {
    return <div className="center"><p>Loading the data ... Thank you for your patience!</p></div>;
  }

  // Get the list of keys, minus the last two
  const allKeys = Object.keys(demograph[0]);
  const visibleKeys = allKeys.slice(0, 16);  // removes last two keys
  console.log("Detected columns:", visibleKeys);

  return (
    <div>
      <div className="centerTitle">
        <h1>Data from Student Demographics</h1>
        <div style={{ textAlign: 'right' }}>
          <button className="dataButton" onClick={() => router.push('/')}>Home</button>
        </div>
      </div>

      <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {visibleKeys.map((key) => (
              <th key={key}>
                {key}
                <br />
                <input
                  type="text"
                  placeholder="Filter"
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                  style={{ width: '90%' }}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (

            <tr key={index}>
              {visibleKeys.map((key, idx) => (
                <td key={idx}>{row[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
