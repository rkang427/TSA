import React, { useState, useEffect, useRef } from 'react';
import { Doughnut, Line } from "react-chartjs-2";
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
  const [showExitTicketTable, setShowExitTicketTable] = useState(true);
  const [showTimelineDetails, setShowTimelineDetails] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState('All Tickets');
  const [allTickets, setAllTickets] = useState([]);

  useEffect(() => {
    if (data) {
      const sortedSchools = Object.entries(data)
        .map(([schoolName, value]) => ({ schoolName, ...value }))
        .sort((a, b) => a.schoolName.localeCompare(b.schoolName));
      setSchools(sortedSchools);
      setSelectedSchool('All Schools');
      setSelectedTicket('All Tickets');
    }
  }, [data]);

  const selectedData =
    selectedSchool === "All Schools"
      ? schools
      : schools.find((item) => item.schoolName === selectedSchool);

  useEffect(() => {
    if (!selectedData) return;

    const dataArray = Array.isArray(selectedData) ? selectedData : [selectedData];
    const ticketCounts = {};

    dataArray.forEach((school) => {
      if (!school.date) return;
      Object.values(school.date).forEach(entry => {
        if (Array.isArray(entry.tickets)) {
          entry.tickets.forEach(ticket => {
            if (ticket && ticket !== 'Unknown') {
              ticketCounts[ticket] = (ticketCounts[ticket] || 0) + 1;
            }
          });
        }
      });
    });

    const ticketsWithCounts = Object.entries(ticketCounts)
      .map(([ticket, count]) => ({ ticket, count }))
      .sort((a, b) => b.count - a.count);

    setAllTickets([{ ticket: 'All Tickets' }, ...ticketsWithCounts]);
    setSelectedTicket('All Tickets');
  }, [selectedData]);

  useEffect(() => {
    if (!data) return;

    const monthMap = {};

    Object.entries(data).forEach(([schoolName, schoolData]) => {
      if (!schoolData.date) return;

      Object.entries(schoolData.date).forEach(([dateStr, entry]) => {
        const date = new Date(dateStr);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthMap[monthKey]) {
          monthMap[monthKey] = { count: 0, tickets: {} };
        }

        if (selectedTicket === 'All Tickets') {
          monthMap[monthKey].count += entry.count || 0;
        } else if (Array.isArray(entry.tickets) && entry.tickets.includes(selectedTicket)) {
          monthMap[monthKey].count += entry.count || 0;
        }

        if (Array.isArray(entry.tickets)) {
          entry.tickets.forEach(ticket => {
            if (ticket && ticket !== 'Unknown') {
              monthMap[monthKey].tickets[ticket] = (monthMap[monthKey].tickets[ticket] || 0) + 1;
            }
          });
        }
      });
    });

    const sortedMonths = Object.keys(monthMap).sort();
    const dateLabels = sortedMonths.map(monthKey => {
      const [year, month] = monthKey.split('-');
      return new Date(`${year}-${month}-01`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    });

    const submissionCounts = sortedMonths.map(monthKey => monthMap[monthKey].count);

    setChartData({
      labels: dateLabels,
      datasets: [
        {
          label: selectedTicket === 'All Tickets'
            ? 'Monthly Submission Count'
            : `${selectedTicket} Submission Count`,
          data: submissionCounts,
          fill: false,
          borderColor: 'rgba(201, 176, 22, 1)',
          tension: 0.1
        }
      ]
    });
  }, [data, selectedTicket]);
  useEffect(() => {
    if (!selectedData) return;

    const isAllSchools = selectedSchool === 'All Schools';
    const dataArray = Array.isArray(selectedData) ? selectedData : [selectedData];

    if (isAllSchools) {
      const countsBySchool = {};
      dataArray.forEach((school) => {
        let totalCount = 0;
        if (!school.date) return;
        Object.values(school.date).forEach(entry => {
          const isIncluded =
            selectedTicket === 'All Tickets' ||
            (Array.isArray(entry.tickets) && entry.tickets.includes(selectedTicket));
          if (isIncluded) {
            totalCount += entry.count || 0;
          }
        });
        if (totalCount > 0) {
          countsBySchool[school.schoolName] = totalCount;
        }
      });

      const sortedCounts = Object.entries(countsBySchool)
        .map(([schoolName, count]) => ({ schoolName, count }))
        .sort((a, b) => b.count - a.count);

      setExitTicketCounts(sortedCounts);
    } else {
      const ticketCounts = {};
      const school = dataArray[0];

      if (school && school.date) {
        Object.values(school.date).forEach(entry => {
          if (Array.isArray(entry.tickets)) {
            entry.tickets.forEach(ticket => {
              if (ticket && ticket !== 'Unknown') {
                if (
                  selectedTicket === 'All Tickets' ||
                  ticket === selectedTicket
                ) {
                  ticketCounts[ticket] = (ticketCounts[ticket] || 0) + (entry.count || 0);
                }
              }
            });
          }
        });
      }

      const sortedTickets = Object.entries(ticketCounts)
        .map(([ticket, count]) => ({ ticket, count }))
        .sort((a, b) => b.count - a.count);

      setExitTicketCounts(sortedTickets);
    }
  }, [selectedData, selectedTicket, selectedSchool]);

  useEffect(() => {
    if (data) {
      const sortedSchools = Object.entries(data)
        .map(([schoolName, value]) => ({ schoolName, ...value }))
        .sort((a, b) => a.schoolName.localeCompare(b.schoolName));
      setSchools(sortedSchools);
    }
  }, [data]);

  useEffect(() => {
    if (selectedData) {
      const genderCounts = {};
      const dataArray = Array.isArray(selectedData) ? selectedData : [selectedData];

      dataArray.forEach((school) => {
        if (!school.date) return;
        Object.values(school.date).forEach(entry => {
          const isIncluded =
            selectedTicket === 'All Tickets' ||
            (Array.isArray(entry.tickets) && entry.tickets.includes(selectedTicket));
          if (!isIncluded) return;
          if (school.gender) {
            Object.entries(school.gender).forEach(([gender, count]) => {
              genderCounts[gender] = (genderCounts[gender] || 0) + count;
            });
          }
        });
      });

      const genderDist = Object.entries(genderCounts).map(([gender, count]) => ({ gender, count }));

      setGender({
        labels: genderDist.map(({ gender }) => gender),
        datasets: [
          {
            label: 'Gender',
            data: genderDist.map(({ count }) => count),
            backgroundColor: ['#6e2c6f', '#c9b016', '#e74c3c'],
            fill: false,
            borderColor: 'rgba(201, 176, 22, 1)',
            tension: 0.1
          }
        ]
      });
    }
  }, [selectedData, selectedTicket]);

  useEffect(() => {
    if (!selectedData) return;

    const dataArray = Array.isArray(selectedData) ? selectedData : [selectedData];
    const ethnicityCounts = {};
    const gradeCounts = {};

    dataArray.forEach((school) => {
      if (!school.date) return;

      Object.values(school.date).forEach(entry => {
        const isIncluded =
          selectedTicket === 'All Tickets' ||
          (Array.isArray(entry.tickets) && entry.tickets.includes(selectedTicket));
        if (!isIncluded) return;

        if (school.race) {
          Object.entries(school.race).forEach(([ethnicity, count]) => {
            ethnicityCounts[ethnicity] = (ethnicityCounts[ethnicity] || 0) + count;
          });
        }

        if (school.grade) {
          Object.entries(school.grade).forEach(([grade, count]) => {
            gradeCounts[grade] = (gradeCounts[grade] || 0) + count;
          });
        }
      });
    });

    const ethnicityDist = Object.entries(ethnicityCounts).map(([ethnicity, count]) => ({ ethnicity, count }));
    const gradeDist = Object.entries(gradeCounts)
      .map(([grade, count]) => ({ grade, count }))
      .filter(({ grade }) => grade.length <= 5);

    setEthnicity({
      labels: ethnicityDist.map(({ ethnicity }) => ethnicity),
      datasets: [
        {
          label: 'Ethnicity',
          data: ethnicityDist.map(({ count }) => count),
          backgroundColor: ['#6e2c6f', '#c9b016', '#e74c3c', '#1abc9c', '#f39c12', '#9b59b6', '#3498db', '#e74c3c', '#2ecc71'],
          borderColor: 'rgba(201, 176, 22, 1)'
        }
      ]
    });

    setGrade({
      labels: gradeDist.map(({ grade }) => grade),
      datasets: [
        {
          label: 'Grade',
          data: gradeDist.map(({ count }) => count),
          backgroundColor: ['#6e2c6f', '#c9b016', '#e74c3c', '#2980b9', '#e67e22', '#8e44ad', '#27ae60', '#d35400', '#7f8c8d'],
          borderColor: 'rgba(201, 176, 22, 1)'
        }
      ]
    });
  }, [selectedData, selectedTicket]);

  useEffect(() => {
    if (selectedData && selectedData.county) {
      const countyDist = Object.entries(selectedData.county).map(([county, count]) => ({
        county,
        count
      }));
      setCounty(countyDist);
    }
  }, [selectedData]);
  useEffect(() => {
    if (!selectedData) return;

    const dataArray = Array.isArray(selectedData) ? selectedData : [selectedData];
    const monthMap = {};

    dataArray.forEach((school) => {
      if (!school.date) return;

      Object.entries(school.date).forEach(([dateStr, entry]) => {
        const date = new Date(dateStr);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthMap[monthKey]) {
          monthMap[monthKey] = { count: 0, tickets: {} };
        }

        monthMap[monthKey].count += entry.count || 0;

        if (Array.isArray(entry.tickets)) {
          entry.tickets.forEach((ticket) => {
            if (ticket && ticket !== 'Unknown') {
              monthMap[monthKey].tickets[ticket] = (monthMap[monthKey].tickets[ticket] || 0) + 1;
            }
          });
        }
      });
    });

    const sortedMonths = Object.keys(monthMap).sort();

    const dateLabels = sortedMonths.map(monthKey => {
      const [year, month] = monthKey.split('-');
      return new Date(`${year}-${month}-01`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    });

    const submissionCounts = sortedMonths.map(monthKey => monthMap[monthKey].count);

    const aggregatedTickets = {};
    sortedMonths.forEach((monthKey) => {
      const ticketCounts = monthMap[monthKey].tickets;
      Object.entries(ticketCounts).forEach(([ticket, count]) => {
        aggregatedTickets[ticket] = (aggregatedTickets[ticket] || 0) + count;
      });
    });

    setChartData({
      labels: dateLabels,
      datasets: [
        {
          label: 'Monthly Submission Count',
          data: submissionCounts,
          fill: false,
          borderColor: 'rgba(201, 176, 22, 1)',
          tension: 0.1
        }
      ]
    });
  }, [selectedSchool, data]);

  function formatMetric(gender) {
    return gender
      ? Object.entries(gender).map(([k, v]) => `${k}: ${v}`).join(', ')
      : '-';
  }

  return (
    <div style={{ fontFamily: 'Nunito, sans-serif', marginLeft: '30px' }}>
      <label>
        Select School:{' '}
        <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
          <option value="All Schools">
            All Schools ({schools.reduce((sum, s) => sum + (s.count ?? 0), 0)})
          </option>
          {schools.map((s) => (
            <option key={s.schoolName} value={s.schoolName}>
              {s.schoolName} ({s.count ?? 0})
            </option>
          ))}
        </select>
      </label>

      <br />

      <label>
        Select Exit Ticket:{' '}
        <select value={selectedTicket} onChange={(e) => setSelectedTicket(e.target.value)}>
          {allTickets.map(({ ticket, count }) => (
            <option key={ticket} value={ticket}>
              {ticket === 'All Tickets' ? ticket : `${ticket} (${count ?? 0})`}
            </option>
          ))}
        </select>
      </label>

      <div style={{ marginTop: '40px', display: 'flex', gap: '40px', justifyContent: 'center' }}>
        {gender && (
          <div style={{ width: '300px', height: '300px' }}>
            <h3 style={{ textAlign: 'center' }}>Gender Distribution</h3>
            <Doughnut data={gender} />
          </div>
        )}
        {ethnicity && (
          <div style={{ width: '300px', height: '300px' }}>
            <h3 style={{ textAlign: 'center' }}>Ethnicity Distribution</h3>
            <Doughnut data={ethnicity} />
          </div>
        )}
        {grade && (
          <div style={{ width: '300px', height: '300px' }}>
            <h3 style={{ textAlign: 'center' }}>Grade Distribution</h3>
            <Doughnut data={grade} />
          </div>
        )}
      </div>

      <br /><br />

      {exitTicketCounts.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, paddingRight: '10px', whiteSpace: 'nowrap' }}>
              {selectedSchool === 'All Schools'
                ? selectedTicket === 'All Tickets'
                  ? 'Exit Ticket Count (All Tickets)'
                  : `Exit Ticket Count for "${selectedTicket}"`
                : selectedTicket === 'All Tickets'
                  ? `Exit Tickets at ${selectedSchool}`
                  : `Count of "${selectedTicket}" at ${selectedSchool}`}
            </h3>
            <button
              onClick={() => setShowExitTicketTable(!showExitTicketTable)}
              style={{
                cursor: 'pointer',
                backgroundColor: '#c9b016',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '4px',
                color: '#6e2c6f',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}
            >
              {showExitTicketTable ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          {showExitTicketTable && (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '10px'
              }}
              border="1"
            >
              <thead>
                <tr>
                  <th>{selectedSchool === 'All Schools' ? 'School' : 'Exit Ticket'}</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {exitTicketCounts.map((row) => (
                  <tr
                    key={`${
                      selectedSchool === 'All Schools' ? row.schoolName : selectedSchool
                    }-${row.ticket || row.schoolName}`}
                  >
                    <td>{selectedSchool === 'All Schools' ? row.schoolName : row.ticket}</td>
                    <td>{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {chartData && (
        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, paddingRight: '10px', whiteSpace: 'nowrap' }}>
              Submission Trend Over Time
            </h3>
            <button
              onClick={() => setShowTimelineDetails(!showTimelineDetails)}
              style={{
                cursor: 'pointer',
                backgroundColor: '#c9b016',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '4px',
                color: '#6e2c6f',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}
            >
              {showTimelineDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          {showTimelineDetails && <Line data={chartData} />}
        </div>
      )}
    </div>
  );
};

export default HowMuchChart;
