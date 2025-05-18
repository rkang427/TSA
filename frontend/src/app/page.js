"use client";
import React, { useRef, useEffect, useState } from 'react';
import Papa from 'papaparse';
import Chart from 'chart.js/auto';
import 'ol/ol.css';
import { useRouter } from 'next/navigation';


import BeforeAfterChart from '@/components/BeforeAfterChart';
import TopCountyGenderChart from '@/components/TopCountyGenderChart';
import MapChart from '@/components/MapChart';
import ExitTicketChart from '@/components/ExitTicketChart';
import CityDemographicsChart from '@/components/CityDemographicsChart';
import HowMuchChart from '@/components/howMuchChart'
import useCSVData from '@/hooks/useCSVData';



const Home = () => {
  const demograph = useCSVData('/student_demographics.csv');
  const beforeAfterData = useCSVData('/before_and_after.csv');
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const exitTicketChartRef = useRef(null);
  const router = useRouter();
  const [showGenderTable, setShowGenderTable] = useState(true);
  const [countyFreq, setCountyFreq] = useState([]);

  useEffect(() => {
    if (!demograph.length) return;

    const countyData = demograph.reduce((acc, curr) => {
      const county = curr['County of Residence'];
      const gender = curr['Gender'];

      if (county && county !== 'Unknown') {
        if (!acc[county]) {
          acc[county] = { count: 1, gender: {} };
        } else {
          acc[county].count += 1;
        }

        if (gender && gender !== 'Unknown') {
          acc[county].gender[gender] = (acc[county].gender[gender] || 0) + 1;
        }
      }
      return acc;
    }, {});

    const sortedCountyFreq = Object.entries(countyData)
      .map(([county, data]) => ({ county, ...data }))
      .sort((a, b) => b.count - a.count);

    setCountyFreq(sortedCountyFreq.slice(0, 7));
  }, [demograph]);



  // dynamic charts
  useEffect(() => {
    if (!hoveredFeature) return;

    const { exitTicketData, genderData, raceData } = hoveredFeature;

    const exitTicketLabels = Object.keys(exitTicketData.reduce((acc, curr) => {
      acc[curr['Exit Ticket Name']] = (acc[curr['Exit Ticket Name']] || 0) + 1;
      return acc;
    }, {}));
    const exitTicketCounts = exitTicketLabels.map(label =>
      exitTicketData.filter(item => item['Exit Ticket Name'] === label).length
    );

    const renderChart = (ref, labels, data) => {
      if (!ref.current) return;

      if (ref.current.chartInstance) {
        ref.current.chartInstance.destroy();
      }
      const ctx = ref.current.getContext('2d', { willReadFrequently: true });
      ref.current.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Count',
            data,
            backgroundColor: 'rgb(201, 176, 22)'
          }]
        },
        options: { responsive: true }
      });
    };

    renderChart(exitTicketChartRef, exitTicketLabels, exitTicketCounts);
  }, [hoveredFeature]);

  return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{position: 'absolute', top: '30px', left: '30px', zIndex: 1001}}>
          <img src="/logo.png" alt="Logo" style={{height: '60px'}}/>
        </div>
        {/*<div style={{marginTop: '1rem', color: 'rgb(110, 44, 111)'}}>*/}
        {/*  <button className="dataButton" onClick={() => router.push('/view-data')}>*/}
        {/*    View Data*/}
        {/*  </button>*/}
        {/*</div>*/}
        {/*<div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>*/}
        {/*  <div style={{width: '60%'}}>*/}
        {/*    <MapChart onFeatureClick={setHoveredFeature} demograph={demograph} />*/}
        {/*  </div>*/}

        {/* {showGenderTable && (*/}
        {/*<div style={{border: '3px solid rgb(201, 176, 22)', width: '40%', padding: '1rem'}}>*/}
        {/*  <h3 className='graphTitle' >*/}
        {/*    Top 7 Counties with Highest Participation*/}
        {/*  </h3>*/}
        {/*  <TopCountyGenderChart countyFreq={countyFreq} />*/}
        {/*</div>*/}
      {/*)}*/}

      {/*    {hoveredFeature && (*/}
      {/*        <div style={{width: '80%', padding: '1rem'}}>*/}
      {/*          <div className='graphTitle'>*/}
      {/*            <h3>Exit Ticket Count for {hoveredFeature.zipCode} ({hoveredFeature.city})</h3>*/}
      {/*          </div>*/}
      {/*            <ExitTicketChart data={hoveredFeature.exitTicketData} />*/}
      {/*        </div>*/}
      {/*    )}*/}
      {/*  </div>*/}

      {/*  <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', height: '100%'}}>*/}
      {/*      <CityDemographicsChart demograph={demograph}/>*/}

      {/*      <BeforeAfterChart beforeAfterData={beforeAfterData} />*/}
      {/*  </div>*/}

      </div>
  );

};

export default Home;
