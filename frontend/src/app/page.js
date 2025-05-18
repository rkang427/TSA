"use client";
import React, { useRef, useEffect, useState } from 'react';
import Papa from 'papaparse';
import Chart from 'chart.js/auto';
import 'ol/ol.css';
import { useRouter } from 'next/navigation';

//graph components
import BeforeAfterChart from '@/components/BeforeAfterChart';
import TopCountyGenderChart from '@/components/TopCountyGenderChart';
import MapChart from '@/components/MapChart';
import ExitTicketChart from '@/components/ExitTicketChart';
import CityDemographicsChart from '@/components/CityDemographicsChart';
import HowMuchChart from '@/components/HowMuchChart'
import useCSVData from '@/hooks/useCSVData';



const Home = () => {
  const demograph = useCSVData('/student_demographics.csv');
  const beforeAfterData = useCSVData('/before_and_after.csv');
  const semanticsData = useCSVData('/semantics.csv');
  const semanticsLabels = useCSVData('/sem_sentiment.csv');
  const semanticsScores = useCSVData('/sem_sentiment_score.csv');
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [showChart, setShowChart] = useState(false);


  const exitTicketChartRef = useRef(null);
  const router = useRouter();
  const [showGenderTable, setShowGenderTable] = useState(true);
  const [countyFreq, setCountyFreq] = useState([]);

  //   NEW DESIGN STARTING HERE   //
  //for HowMuchChart.js
  const [howMuchData, setHowMuchData] = useState({});
  const [howMuchDataCity, setHowMuchDataCity] = useState({});


  // PILLAR 1 - HOW MUCH //
  //for HowMuchChart.js
  useEffect(() => {
  if (!demograph.length) return;

  const howMuchData = demograph.reduce((acc, curr) => {
    const state = curr['State'];
    const county = curr['County of Residence'];
    const city = curr['City'];
    const schoolName = curr['School Name'];
    const gender = curr['Gender'];
    const grade = curr['Grade Level'];
    const race = curr['Race/Ethnicity'];
    const age = curr['Age'];
    const date = curr['Submission Date'];

    if (state && state !== 'Unknown') {
      if (!acc[state]) {
        acc[state] = { counties: {} };
      }

      if (county && county !== 'Unknown') {
        if (!acc[state].counties[county]) {
          acc[state].counties[county] = { cities: {} };
        }

        if (city && city !== 'Unknown') {
          if (!acc[state].counties[county].cities[city]) {
            acc[state].counties[county].cities[city] = { schools: {} };
          }

          if (schoolName && schoolName !== 'Unknown') {
            if (!acc[state].counties[county].cities[city].schools[schoolName]) {
              acc[state].counties[county].cities[city].schools[schoolName] = { count: 0, gender: {}, race: {},
                age: {}, grade: {}, date: {} };
            }

            const schoolData = acc[state].counties[county].cities[city].schools[schoolName];

            schoolData.count += 1;

            if (gender && gender !== 'Unknown') {
              schoolData.gender[gender] = (schoolData.gender[gender] || 0) + 1;
            }

            if (race && race !== 'Unknown') {
              schoolData.race[race] = (schoolData.race[race] || 0) + 1;
            }

            if (age && age !== 'Unknown') {
              schoolData.age[age] = (schoolData.age[age] || 0) + 1;
            }

            if (grade && grade !== 'Unknown') {
              schoolData.grade[grade] = (schoolData.grade[grade] || 0) + 1;
            }

            if (date && date !== 'Unknown') {
              schoolData.date[date] = (schoolData.date[date] || 0) + 1;
            }


          }
        }
      }
    }

    return acc;
  }, {});

}, [demograph]);

  // high school aggregated
  useEffect(() => {
  if (!demograph.length) return;

  const howMuchDataCity = demograph.reduce((acc, curr) => {
    const schoolName = curr['School Name'];
    if (!schoolName || schoolName === 'Unknown') return acc;

    if (!acc[schoolName]) {
      acc[schoolName] = {
        count: 0,
        gender: {},
        grade: {},
        county: {},
        race: {},
        date: {}
      };
    }

    const school = acc[schoolName];
    school.count += 1;

    const updateField = (field, value) => {
      if (value && value !== 'Unknown') {
        school[field][value] = (school[field][value] || 0) + 1;
      }
    };

    updateField('gender', curr['Gender']);
    updateField('grade', curr['Grade Level']);
    updateField('county', curr['County of Residence']);
    updateField('race', curr['Race/Ethnicity']);
    const date = curr['Submission Date'];
  const ticket = curr['Exit Ticket Name'];

  if (date && date !== 'Unknown') {
    if (!school.date[date]) {
      school.date[date] = { count: 0, tickets: [] };
    }
    school.date[date].count += 1;

    if (ticket && ticket !== 'Unknown') {
      school.date[date].tickets.push(ticket);
    }
  }


    return acc;
  }, {});

  const sortedBySchoolName = Object.entries(howMuchDataCity)
    .sort(([aName], [bName]) => aName.localeCompare(bName))
    .map(([schoolName, data]) => ({
      schoolName,
      ...data
    }));
  setHowMuchDataCity(sortedBySchoolName);

}, [demograph]);

  // old code - uncomment if not running well
  //for top 7 counties
  // useEffect(() => {
  //   if (!demograph.length) return;
  //
  //   const countyData = demograph.reduce((acc, curr) => {
  //     const county = curr['County of Residence'];
  //     const gender = curr['Gender'];
  //
  //     if (county && county !== 'Unknown') {
  //       if (!acc[county]) {
  //         acc[county] = { count: 1, gender: {} };
  //       } else {
  //         acc[county].count += 1;
  //       }
  //
  //       if (gender && gender !== 'Unknown') {
  //         acc[county].gender[gender] = (acc[county].gender[gender] || 0) + 1;
  //       }
  //     }
  //     return acc;
  //   }, {});
  //
  //   const sortedCountyFreq = Object.entries(countyData)
  //     .map(([county, data]) => ({ county, ...data }))
  //     .sort((a, b) => b.count - a.count);
  //
  //   setCountyFreq(sortedCountyFreq.slice(0, 7));
  // }, [demograph]);

  // useEffect(() => {
  //   if (!hoveredFeature) return;
  //
  //   const { exitTicketData, genderData, raceData } = hoveredFeature;
  //
  //   const exitTicketLabels = Object.keys(exitTicketData.reduce((acc, curr) => {
  //     acc[curr['Exit Ticket Name']] = (acc[curr['Exit Ticket Name']] || 0) + 1;
  //     return acc;
  //   }, {}));
  //   const exitTicketCounts = exitTicketLabels.map(label =>
  //     exitTicketData.filter(item => item['Exit Ticket Name'] === label).length
  //   );
  //
  //   const renderChart = (ref, labels, data) => {
  //     if (!ref.current) return;
  //
  //     if (ref.current.chartInstance) {
  //       ref.current.chartInstance.destroy();
  //     }
  //     const ctx = ref.current.getContext('2d', { willReadFrequently: true });
  //     ref.current.chartInstance = new Chart(ctx, {
  //       type: 'bar',
  //       data: {
  //         labels,
  //         datasets: [{
  //           label: 'Count',
  //           data,
  //           backgroundColor: 'rgb(201, 176, 22)'
  //         }]
  //       },
  //       options: { responsive: true }
  //     });
  //   };
  //
  //   renderChart(exitTicketChartRef, exitTicketLabels, exitTicketCounts);
  // }, [hoveredFeature]);


  return (
      <div style={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
        <div style={{position: 'absolute', top: '30px', left: '30px', zIndex: 1001}}>
          <img src="/logo.png" alt="Logo" style={{height: '60px'}}/>
        </div>

        <div style={{marginTop: '80px', padding: '20px',display: 'flex'}}>
          <h1>How Much?</h1>
          <button
              onClick={() => setShowChart(prev => !prev)}
              style={{
                marginBottom: '20px',
                marginLeft: '20px',
                marginTop: '25px',
                height: '40px',
                padding: '10px 10px',
                backgroundColor: '#c9b016',
                color: '#6e2c6f',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
          >
            {showChart ? 'Less Information' : 'More Info'}
          </button>

        </div>

          {showChart && (
              <HowMuchChart data={howMuchDataCity}/>
          )}


        {/* old code - uncomment if not running well */}
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
