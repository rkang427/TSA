"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const prepareDistributionData = (data, fieldName, color) => {
  const counts = {};
  data.forEach((entry) => {
    const key = entry[fieldName]?.trim();
    if (key) {
      counts[key] = (counts[key] || 0) + 1;
    }
  });

  return {
    labels: Object.keys(counts),
    datasets: [
      {
        label: `${fieldName} Distribution`,
        data: Object.values(counts),
        backgroundColor: color || "#7b3fa1",
      },
    ],
  };
};

const BarChart = ({ title, chartData }) => (
  <div
    style={{
      flex: 1,
      minWidth: "300px",
      maxWidth: "600px",
      height: "280px",
      padding: "10px",
      boxSizing: "border-box",
    }}
  >
    <h3 style={{ textAlign: "center", marginBottom: "8px" }}>{title}</h3>
    <Bar
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
      }}
    />
  </div>
);

const SchoolTable = ({ data }) => {
  const counts = {};
  data.forEach((entry) => {
    const school = entry["School Name"]?.trim();
    if (school) {
      counts[school] = (counts[school] || 0) + 1;
    }
  });

  const topSchools = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(1, 11);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "700px",
        marginTop: "30px",
        overflowX: "auto",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "8px" }}>
        Top 10 Schools by Count
      </h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "black",
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
              School Name
            </th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "8px", textAlign: "right" }}>
              Count
            </th>
          </tr>
        </thead>
        <tbody>
          {topSchools.map(([school, count]) => (
            <tr key={school}>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{school}</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee", textAlign: "right" }}>
                {count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const HowBetterOffChart = ({ data }) => {
  const [averageExperience, setAverageExperience] = useState(null);
  const [maxExperience, setMaxExperience] = useState(null);
  const [totalFAFSA, setTotalFAFSA] = useState(null);
  const [charts, setCharts] = useState({ race: null, grade: null });

  const fixedColor = "#6e2c6f";

  useEffect(() => {
    if (!data || !data.length) return;

    const experienceKey = "How would your rate your overall experience today?";
    const validScores = data
      .map((row) => parseFloat(row[experienceKey]))
      .filter((score) => !isNaN(score));
    if (validScores.length) {
      const avg = validScores.reduce((sum, v) => sum + v, 0) / validScores.length;
      setAverageExperience(avg.toFixed(2));
      setMaxExperience(Math.max(...validScores));
    }

    const fafsaKey = "Were you able to submit your FAFSA during today's session?";
    const fScores = data.filter((row) => row[fafsaKey]?.trim() === "Yes");
    setTotalFAFSA(fScores.length);

    setCharts({
      race: prepareDistributionData(data, "Race/Ethnicity", fixedColor),
      grade: prepareDistributionData(data, "Grade Level", fixedColor),
    });
  }, [data]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
        maxWidth: "100vw",
      }}
    >
      {/* Top Stats */}
      <div
        style={{
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2.8rem", color: fixedColor, margin: 0 }}>
          Average Experience Rating
        </h2>
        {averageExperience !== null ? (
          <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "10px 0" }}>
            {averageExperience} / {maxExperience}
          </p>
        ) : (
          <p>No valid experience ratings found.</p>
        )}

        <h2 style={{ fontSize: "2.8rem", color: fixedColor, marginTop: "30px", marginBottom: 0 }}>
          Total FAFSA Submitted
        </h2>
        {totalFAFSA !== null ? (
          <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "10px 0" }}>{totalFAFSA}</p>
        ) : (
          <p>No one filled out FAFSA yet.</p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          width: "100%",
          maxWidth: "1300px",
        }}
      >
        {charts.race && <BarChart title="Race/Ethnicity Distribution" chartData={charts.race} />}
        {charts.grade && <BarChart title="Grade Level Distribution" chartData={charts.grade} />}
      </div>

      <SchoolTable data={data} />
    </div>
  );
};

export default HowBetterOffChart;
