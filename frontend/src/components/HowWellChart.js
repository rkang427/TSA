"use client";
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, plugins} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HowWellChart = ({ demograph }) => {

    console.log(demograph);
    const [chartData, setChartData] = useState(null);
    const [selectedSchool, setSelectedSchool] = useState("All Schools");
    const [schools, setSchools] = useState([]);

    useEffect(() => {
        if (demograph) {
            const sortedSchools = Object.entries(demograph)
                .map(([key, value]) => ({
                    schoolName: value.schoolName,
                    count: value.count,
                    confidenceMetrics: value.confidenceMetrics
                }))
                .sort((a, b) => {
                    if (!a.schoolName) return 1;
                    if (!b.schoolName) return -1;
                    return a.schoolName.localeCompare(b.schoolName);
                });

            setSchools(sortedSchools);
        }
    }, [demograph]);

    useEffect(() => {
        if (schools.length === 0) return;

        const filteredData = selectedSchool === "All Schools"
            ? schools
            : schools.filter((item) => item.schoolName === selectedSchool);

        if (filteredData.length === 0) return;

        const metricKeys = Object.keys(filteredData[0].confidenceMetrics);

        const labels = metricKeys.map(key => filteredData[0].confidenceMetrics[key].label);

        const newChartData = {
            labels,
            datasets: [
                {
                    label: `${selectedSchool} - Before`,
                    data: metricKeys.map(key => {
                        const values = filteredData.map(school => parseFloat(school.confidenceMetrics[key]?.beforeAvg || 0));
                        return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
                    }),
                    backgroundColor: '#c9b016',
                },
                {
                    label: `${selectedSchool} - After`,
                    data: metricKeys.map(key => {
                        const values = filteredData.map(school => parseFloat(school.confidenceMetrics[key]?.afterAvg || 0));
                        return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
                    }),
                    backgroundColor: '#6e2c6f',
                }
            ]
        };

        setChartData(newChartData);
    }, [selectedSchool, schools]);

    const handleSchoolChange = (e) => {
        setSelectedSchool(e.target.value);
    };

    return (
        <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
            <h3>Average Confidence Levels (Before vs After)</h3>

            <div style={{marginBottom: '20px'}}>
                <label style={{marginRight: '10px'}}>Select School: </label>
                <select onChange={handleSchoolChange} value={selectedSchool}>
                    <option value="All Schools">All Schools ({schools.reduce((sum, s) => sum + (s.count ?? 0), 0)})
                    </option>
                    {schools && schools.length > 0 && (
                        Array.from(new Set(schools.map(item => item.schoolName)))
                            .filter(schoolName => schoolName && schoolName !== 'Unknown')
                            .map(schoolName => (
                                <option key={schoolName} value={schoolName}>
                                    {schoolName} ({schools.find(s => s.schoolName === schoolName)?.count ?? 0})
                                </option>
                            ))
                    )}
                </select>
            </div>

            {chartData && (
                <div style={{width: '70%', maxWidth: '800px'}}>
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {position: 'top'},
                                tooltip: {mode: 'index', intersect: false},
                            },
                            scales: {
                                x: {stacked: false},
                                y: {stacked: false},
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default HowWellChart;
