"use client";

import React, { useState, useEffect, useRef } from 'react';
import {Doughnut, Line, Pie} from "react-chartjs-2";
import Papa from 'papaparse';
import dynamic from 'next/dynamic';



const HowMuchChart = ({ data }) => {
  dynamic(() => import('./HowMuchChart'), { ssr: false });
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schools, setSchools] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [exitTicketCounts, setExitTicketCounts] = useState([]);
  const [gender, setGender] = useState(null);
  const [ethnicity, setEthnicity] = useState(null);
  const [grade, setGrade] = useState(null);
  const [county, setCounty] = useState(null);


  const mapRef = useRef(null);
  const [countyCoordsMap, setCountyCoordsMap] = useState({});
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    if (data) {
      const sortedSchools = Object.entries(data)
        .map(([schoolName, value]) => ({ schoolName, ...value }))
        .sort((a, b) => a.schoolName.localeCompare(b.schoolName));
setSchools(sortedSchools);

      setSchools(sortedSchools);
    }
  }, [data]);



  const selectedData = selectedSchool === "All Schools"
  ? schools
  : schools.find((item) => item.schoolName === selectedSchool);

  useEffect(() => {
    if (selectedData && selectedData.gender) {
      const genderDist = Object.entries(selectedData.gender).map(([gender, count]) =>
      {
          return { gender, count };
    });
      setGender({
        labels: genderDist.map(({ gender }) => gender),
        datasets: [
          {
            label: 'Gender',
            data: genderDist.map(({ count }) => count),
            backgroundColor: ['#6e2c6f', '#c9b016', '#e74c3c'],
            fill: false,
            borderColor: 'rgba(201, 176, 22, 1)',
            tension: 0.1,
          },
        ],
      });
}

    if (selectedData && selectedData.race) {
      const raceDist = Object.entries(selectedData.race).map(([race, count]) => {
        return {race, count};
      });
      setEthnicity({
        labels: raceDist.map(({race}) => race),
        datasets: [
          {
            label: 'Ethnicity',
            data: raceDist.map(({count}) => count),
            backgroundColor: ['#6e2c6f', '#c9b016', '#e74c3c', '#f39c12', '#3498db', '#2ecc71'],
            fill: false,
            borderColor: 'rgba(201, 176, 22, 1)',
            tension: 0.1,
          },
        ],
      });
    }

      if (selectedData && selectedData.grade) {
      const gradeDist = Object.entries(selectedData.grade).map(([grade, count]) =>
      {
          return { grade, count };
    });
      setGrade({
        labels: gradeDist.map(({ grade }) => grade),
        datasets: [
          {
            label: 'Grade',
            data: gradeDist.map(({ count }) => count),
            backgroundColor: ['#6e2c6f', '#c9b016', '#e74c3c','#f39c12', '#3498db', '#2ecc71'],
            fill: false,
            borderColor: 'rgba(201, 176, 22, 1)',
            tension: 0.1,
          },
        ],
      });
}


  }, [selectedData]);



  //map

  useEffect(() => {
    if (selectedData && selectedData.county) {
      const countyDist = Object.entries(selectedData.county).map(([county, count]) => {
        return { county, count };
      });
      setCounty(countyDist);
    }
  }, [selectedData]);



  useEffect(() => {
    if (selectedData && selectedData.date) {
      const rawDateLabels = Object.keys(selectedData.date);

      const dateLabels = rawDateLabels.map((a) =>
        new Date(a).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      );

      const dateCounts = rawDateLabels.map((date) => selectedData.date[date]);
      const submissionCounts = dateCounts.map((entry) => entry.count);
      const aggregatedTickets = {};

      Object.keys(selectedData.date).forEach((dateKey) => {
        const dateData = selectedData.date[dateKey];
        if (dateData && Array.isArray(dateData.tickets)) {
          dateData.tickets.forEach((ticket) => {
            if (ticket && ticket !== 'Unknown') {
              aggregatedTickets[ticket] = (aggregatedTickets[ticket] || 0) + 1;
            }
          });
        }
      });


      //ticket counts
      // TODO: onclick action with above
      const aggregatedTicketArray = Object.entries(aggregatedTickets)
        .map(([ticket, count]) => ({ ticket, count }))
        .sort((a, b) => b.count - a.count);
      setExitTicketCounts(aggregatedTicketArray);

      setChartData({
        labels: dateLabels,
        datasets: [
          {
            label: 'Submission Count',
            data: submissionCounts,
            fill: false,
            borderColor: 'rgba(201, 176, 22, 1)',
            tension: 0.1,
          },
        ],
      });
    }
  }, [selectedSchool, data]);




  function formatMetric(gender) {
  return gender
    ? Object.entries(gender)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ')
    : '-';
}


  return (
      <div style={{fontFamily: 'Nunito, sans-serif', marginLeft: '30px'}}>
        <label>
          Select School:{' '}
          <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
          >
            <option value="">-- Select --</option>
            {schools.map((s) => (
                <option key={s.schoolName} value={s.schoolName}>
                  {s.schoolName} ({s.count ?? 0})
                </option>
            ))}
          </select>
        </label>

        {selectedData && (
            <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '20px',
                }}
                border="1"
            >
              <thead>
              <tr>
                <th>Metric</th>
                <th>Values</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>Count</td>
                <td>{selectedData.count}</td>
              </tr>
              <tr>
                <td>County</td>
                <td>{selectedData.county && Object.keys(selectedData.county).length > 0
                    ? formatMetric(selectedData.county)
                    : 'N/A'}</td>
              </tr>
              </tbody>
            </table>
        )}
        <br></br>


        <div style={{marginTop: '40px', display: 'flex', gap: '40px', justifyContent: 'center'}}>
          {gender && (
              <div style={{width: '300px', height: '300px'}}>
                <h3 style={{textAlign: 'center'}}>Gender Distribution</h3>
                <Doughnut data={gender}/>
              </div>)}
          {ethnicity && (
              <div style={{width: '300px', height: '300px'}}>
                <h3 style={{textAlign: 'center'}}>Ethnicity Distribution</h3>
                <Doughnut data={ethnicity}/>
              </div>)}
          {grade && (
              <div style={{width: '300px', height: '300px'}}>
                <h3 style={{textAlign: 'center'}}>Grade Distribution</h3>
                <Doughnut data={grade}/>
              </div>)}
        </div>
        <br></br>
        <br></br>


        {
            exitTicketCounts.length > 0 && (
                <div style={{marginTop: '40px'}}>
                  <h3>Exit Ticket Count</h3>
                  <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginTop: '20px',
                      }}
                      border="1"
                  >
                    <thead>
                    <tr>
                      <th>Exit Ticket</th>
                      <th>Count</th>
                    </tr>
                    </thead>
                    <tbody>
                    {exitTicketCounts.length > 0 && exitTicketCounts.map(({ticket, count}) => (
                        <tr key={ticket}>
                          <td>{ticket}</td>
                          <td>{count}</td>
                        </tr>
                    ))}
                    </tbody>

                  </table>
                </div>
            )}

        {chartData && (
            <div style={{marginTop: '40px'}}>
              <h3>Submission Trend Over Time</h3>
              <Line
                  data={chartData}
              />
            </div>
        )}
      </div>
  );
};

export default HowMuchChart;
