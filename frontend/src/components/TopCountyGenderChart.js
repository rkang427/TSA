'use client';
import React from 'react';

const renderGenderBar = (genderData) => {
  const total = Object.values(genderData).reduce((acc, count) => acc + count, 0);
  return (
    <div style={{ display: 'flex', width: '105px', border: '3px solid rgb(110, 44, 111)' }}>
      {Object.entries(genderData).map(([gender, count]) => {
        const percentage = (count / total) * 100;
        const color =
          gender === 'Male'
            ? 'rgb(201, 176, 22)'
            : gender === 'Female'
            ? 'rgb(110, 44, 111)'
            : 'white';
        return (
          <div
            key={gender}
            style={{
              backgroundColor: color,
              width: `${percentage}%`,
              height: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: 'white',
              paddingLeft: '4px'
            }}
          >
            {percentage >= 15 && <span>{gender} ({Math.round(percentage)}%)</span>}
          </div>
        );
      })}
    </div>
  );
};

const GenderDistributionTable = ({ countyFreq }) => {
  return (
    <table
      border="1"
      style={{
        width: '100%',
        marginTop: '15px',
        borderCollapse: 'collapse',
        color: 'rgb(110, 44, 111)'
      }}
    >
      <thead>
        <tr>
          <th>County</th>
          <th>Count</th>
          <th>Gender Distribution</th>
        </tr>
      </thead>
      <tbody>
        {countyFreq.map((countyData) => (
          <tr key={countyData.county}>
            <td style={{ paddingLeft: '65px' }}>{countyData.county}</td>
            <td style={{ paddingLeft: '50px' }}>{countyData.count}</td>
            <td style={{ paddingLeft: '55px' }}>
              {renderGenderBar(countyData.gender)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GenderDistributionTable;
