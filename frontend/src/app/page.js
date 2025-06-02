"use client";
import React, { useRef, useEffect, useState } from 'react';
import Papa from 'papaparse';
import Chart from 'chart.js/auto';
import 'ol/ol.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
//graph components
import BeforeAfterChart from '@/components/BeforeAfterChart';
import TopCountyGenderChart from '@/components/TopCountyGenderChart';
import MapChart from '@/components/MapChart';
import ExitTicketChart from '@/components/ExitTicketChart';
import CityDemographicsChart from '@/components/CityDemographicsChart';
import HowMuchChart from '@/components/HowMuchChart'
import useCSVData from '@/hooks/useCSVData';
import HowWellChart from "@/components/HowWellChart";
import HowBetterOffChart from "@/components/HowBetterOffChart";
//import ImpactChart from "@/components/ImpactChart";
import ImpactMapClient from "@/components/ImpactMapClient";



const Home = () => {
  const [activeTab, setActiveTab] = useState("impact"); // 'impact', 'howMuch', 'howWell', 'howBetterOff'

  const demograph = useCSVData('/cleaned_data_with_sem.csv');
  const geo = useCSVData('/georgia_longitude_and_latitude.csv')
  // const beforeAfterData = useCSVData('/before_and_after.csv');
  const semanticsData = useCSVData('/semantics.csv');
  // const semanticsLabels = useCSVData('/sem_sentiment.csv');
  // const semanticsScores = useCSVData('/sem_sentiment_score.csv');
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [showChart1, setShowChart1] = useState(false);
  const [showChart2, setShowChart2] = useState(false);
  const [showChart3, setShowChart3] = useState(false);
  const [showChartImpact, setShowChartImpact] = useState(false);
  const [combinedData, setCombinedData] = useState([]);

useEffect(() => {
  if (demograph.length && semanticsData.length && demograph.length === semanticsData.length) {
    const merged = demograph.map((row, index) => ({
      ...row,
      ...semanticsData[index]
    }));
    console.log(merged);
    console.log(1);
    setCombinedData(merged);
  }
}, [demograph, semanticsData]);



  //   NEW DESIGN STARTING HERE   //
  //for HowMuchChart.js
  const [howMuchDataCity, setHowMuchDataCity] = useState({});
  const [howWellData, setHowWellData] = useState({});
  const [impactData, setImpactData] = useState({});

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


  useEffect(() => {
  if (!demograph.length) return;

  const confidenceMetrics = [
    {
      key: 'confidence_pay',
      label: 'Confidence in ability to pay for college',
      beforeKey: 'Before this session, how confident were you in your ability to pay for college?',
      afterKey: 'After this session, how confident are you in your ability to pay for college?'
    },
    {
      key: 'confidence_research',
      label: 'Confidence in researching scholarships',
      beforeKey: 'Before this session, how confident were you in your ability to research scholarships that are the best fit for you?',
      afterKey: 'After this session, how confident are you in your ability to research scholarships that are the best fit for you?'
    },
    {
      key: 'confidence_essay',
      label: 'Confidence in writing essays',
      beforeKey: 'Before this session, how would you rate your  confidence  in your ability to write competitive scholarship essays?',
      afterKey: 'After this session, how would you rate your confidence in your ability to write competitive scholarship essays?'
    },
    {
      key: 'confidence_appeal',
      label: 'Confidence in submitting a Financial Aid Appeal',
      beforeKey: 'Before this session, how confident are you in your ability to submit a Financial Aid Appeal?',
      afterKey: 'After this session, how confident are you in your ability to submit a Financial Aid Appeal?'
    },
    {
      key: 'confidence_award_letter',
      label: 'Confidence in understanding Financial Aid Award Letter',
      beforeKey: 'Before this session, how confident were you in your ability to understand a Financial Aid Award Letter?',
      afterKey: 'After this session, how confident are you in your ability to understand a Financial Aid Award Letter?'
    },
    {
      key: 'confidence_fafsa',
      label: 'Confidence in submitting FAFSA',
      beforeKey: 'Before this session, how confident were you in your ability to submit the FAFSA?',
      afterKey: 'After this session, how confident are you in your ability to submit the FAFSA?'
    },
  ];

  const confidenceDataBySchool = demograph.reduce((acc, curr) => {
    const schoolName = curr['School Name'];
    if (!schoolName || schoolName === 'Unknown') return acc;

    if (!acc[schoolName]) {
      acc[schoolName] = {
        count: 0,
        metrics: {}
      };

      confidenceMetrics.forEach(({ key }) => {
        acc[schoolName].metrics[key] = { before: [], after: [] };
      });
    }

    acc[schoolName].count += 1;

    confidenceMetrics.forEach(({ key, beforeKey, afterKey }) => {
      const before = parseFloat(curr[beforeKey]);
      const after = parseFloat(curr[afterKey]);

      if (!isNaN(before)) acc[schoolName].metrics[key].before.push(before);
      if (!isNaN(after)) acc[schoolName].metrics[key].after.push(after);
    });

    return acc;
  }, {});

  const processedData = Object.entries(confidenceDataBySchool).map(([schoolName, data]) => {
    const metrics = {};

    confidenceMetrics.forEach(({ key, label }) => {
      const beforeVals = data.metrics[key].before;
      const afterVals = data.metrics[key].after;

      const avg = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : '0.00';

      metrics[key] = {
        label,
        beforeAvg: avg(beforeVals),
        afterAvg: avg(afterVals)
      };
    });

    return {
      schoolName,
      count: data.count,
      confidenceMetrics: metrics
    };
  });

  setHowWellData(processedData);
}, [demograph]);

    useEffect(() => {
  if (!demograph.length || !geo.length) return;

  const geoLookup = geo.reduce((acc, loc) => {
    const key = `${(loc.City || '').toLowerCase().trim()}_${(loc.Zip || '').trim()}`;
    acc[key] = {
      latitude: parseFloat(loc.Latitude),
      longitude: parseFloat(loc.Longitude),
      city: loc.City,
      zip: loc.Zip
    };
    return acc;
  }, {});

  const schoolCounts = demograph.reduce((acc, entry) => {
    const school = entry['School Name'];
    const city = entry['City'];
    const zip = entry['Zip Code'];

    if (!school || !city || !zip || school === 'Unknown') return acc;

    const key = `${city.toLowerCase().trim()}_${zip.trim()}`;

    if (!acc[school]) {
      acc[school] = {
        schoolName: school,
        count: 0,
        geoKey: key
      };
    }

    acc[school].count += 1;
    return acc;
  }, {});

  const impactMerged = Object.values(schoolCounts).map(school => {
    const geoMatch = geoLookup[school.geoKey] || {};
    return {
      schoolName: school.schoolName,
      count: school.count,
      latitude: geoMatch.latitude,
      longitude: geoMatch.longitude,
      city: geoMatch.city,
      zip: geoMatch.zip
    };
  }).filter(d => d.latitude && d.longitude);
  setImpactData(impactMerged);
}, [demograph, geo]);

   return (
    <div style={{ position: "relative", padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ position: "absolute", top: "30px", left: "30px", zIndex: 1001 }}>
          <Link href="https://scholarshipacademy.org/online/" target="_blank" rel="noopener noreferrer">
            <img src="/logo.png" alt="Logo" style={{ height: "60px" }} />
          </Link>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "80px",
          paddingBottom: "20px",
        }}
      >
        <h1>Our Impact in 2025</h1>

        {/* Tabs on top right */}
        <nav>
          {["impact", "howMuch", "howWell", "howBetterOff"].map((tab) => {
            const label =
              tab === "impact"
                ? "Impact"
                : tab === "howMuch"
                ? "How Much"
                : tab === "howWell"
                ? "How Well"
                : "How Better Off";

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  marginLeft: "15px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  backgroundColor: activeTab === tab ? "#c9b016" : "transparent",
                  color: activeTab === tab ? "#6e2c6f" : "#333",
                  border: "1px solid #c9b016",
                  borderRadius: "5px",
                  fontWeight: "bold",
                }}
              >
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      <div style={{ minHeight: "600px" }}>
        {activeTab === "impact" && (
          <>
            <ImpactMapClient demo={impactData} />
          </>
        )}
        {activeTab === "howMuch" && <HowMuchChart data={howMuchDataCity} />}
        {activeTab === "howWell" && <HowWellChart demograph={howWellData} />}
        {activeTab === "howBetterOff" && <HowBetterOffChart data={combinedData} />}
      </div>
    </div>
  );

};

export default Home;
