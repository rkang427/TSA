"use client";
import React, { useRef, useEffect, useState } from 'react';
import Papa from 'papaparse';
import Chart from 'chart.js/auto';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Circle as CircleStyle, Fill, Style, Stroke } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { useRouter } from 'next/navigation';

const Home = () => {
  const [demograph, setDemograph] = useState([]);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [beforeAfterData, setBeforeAfterData] = useState([]);

  const mapRef = useRef(null);
  const genderChartRef = useRef(null);
  const raceChartRef = useRef(null);
  const exitTicketChartRef = useRef(null);
  const cityChartInstanceRef = useRef(null);
  const router = useRouter();
  const beforeAfterChartRef = useRef(null);


  useEffect(() => {
    fetch('/student_demographics.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setDemograph(results.data);
          }
        });
      })
      .catch(error => console.error('Error fetching CSV:', error));
  }, []);

  useEffect(() => {
    fetch('/before_and_after.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setBeforeAfterData(results.data);
          }
        });
      })
      .catch(error => console.error('Error fetching CSV:', error));
  }, []);

useEffect(() => {
  if (!beforeAfterData.length) return;

  const questions = [
    "Before the session, how many scholarship applications did you submit?",
    "After the session, how many scholarship applications have you submitted?",
    "Before this session, how confident were you in your ability to pay for college?",
    "After this session, how confident are you in your ability to pay for college?",
    "Before this session, how confident were you in your ability to research scholarships that are the best fit for you?",
    "After this session, how confident are you in your ability to research scholarships that are the best fit for you?",
    "Before this session, how would you rate your confidence in your ability to write competitive scholarship essays?",
    "After this session, how would you rate your confidence in your ability to write competitive scholarship essays?",
    "Before this session, how confident are you in your ability to submit a Financial Aid Appeal?",
    "After this session, how confident are you in your ability to submit a Financial Aid Appeal?",
    "Before this session, how confident were you in your ability to understand a Financial Aid Award Letter?",
    "After this session, how confident are you in your ability to understand a Financial Aid Award Letter?",
    "Before this session, how confident were you in your ability to submit the FAFSA?",
    "After this session, how confident are you in your ability to submit the FAFSA?"
  ];

  const questionKeywords = {
    "Before the session, how many scholarship applications did you submit?": 'Scholarship Apps Submitted',
    "After the session, how many scholarship applications have you submitted?": 'Scholarship Apps Submitted',
    "Before this session, how confident were you in your ability to pay for college?": 'Confidence in Paying',
    "After this session, how confident are you in your ability to pay for college?": 'Confidence in Paying',
    "Before this session, how confident were you in your ability to research scholarships that are the best fit for you?": 'Confidence in Researching Scholarships',
    "After this session, how confident are you in your ability to research scholarships that are the best fit for you?": 'Confidence in Researching Scholarships',
    "Before this session, how would you rate your confidence in your ability to write competitive scholarship essays?": 'Confidence in Writing Essays',
    "After this session, how would you rate your confidence in your ability to write competitive scholarship essays?": 'Confidence in Writing Essays',
    "Before this session, how confident are you in your ability to submit a Financial Aid Appeal?": 'Confidence in Financial Aid Appeal',
    "After this session, how confident are you in your ability to submit a Financial Aid Appeal?": 'Confidence in Financial Aid Appeal',
    "Before this session, how confident were you in your ability to understand a Financial Aid Award Letter?": 'Confidence in Understanding Award Letter',
    "After this session, how confident are you in your ability to understand a Financial Aid Award Letter?": 'Confidence in Understanding Award Letter',
    "Before this session, how confident were you in your ability to submit the FAFSA?": 'Confidence in Submitting FAFSA',
    "After this session, how confident are you in your ability to submit the FAFSA?": 'Confidence in Submitting FAFSA'
  };

  const calculateAverage = (data, questionKey) => {
    const total = data
      .map(row => parseInt(row[questionKey] || 0, 10))
      .reduce((a, b) => a + b, 0);

    const count = data.filter(row => row[questionKey]).length;

    return count > 0 ? total / count : 0;
  };

  const beforeData = [];
  const afterData = [];

  questions.forEach((question, d) => {
    const beforeKey = question;
    const afterKey = question.replace('Before', 'After');

    const beforeAverage = calculateAverage(beforeAfterData, beforeKey);
    const afterAverage = calculateAverage(beforeAfterData, afterKey);
    if (d % 2 === 0) { beforeData.push(beforeAverage); }
    else { afterData.push(afterAverage); }
  });

  const chartLabels = questions.filter((_, x) => x % 2 == 0).map(
      (question, x) =>questionKeywords[question]);

  if (beforeAfterChartRef.current) {
    if (beforeAfterChartRef.current.chartInstance) {
      beforeAfterChartRef.current.chartInstance.destroy();
    }

    const ctx = beforeAfterChartRef.current.getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Before Session',
            data: beforeData,
            backgroundColor: 'rgba(201, 176, 22, 0.2)',
            borderColor: 'rgb(201, 176, 22)',
            borderWidth: 1
          },
          {
            label: 'After Session',
            data: afterData,
            backgroundColor: 'rgb(110, 44, 111, 0.2)',
            borderColor: 'rgb(110, 44, 111)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Before and After Confidence Comparison' },
          legend: { position: 'top' },
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}, [beforeAfterData]);

  useEffect(() => {
    if (!demograph.length) return;

    const zip_code_dct = {};
    demograph.forEach(item => {
      zip_code_dct[item['Zip Code']] = (zip_code_dct[item['Zip Code']] || 0) + 1;
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: fromLonLat([-85.0, 33.0]),
        zoom: 7,
        constrainResolution: true,
      })
    });

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({ source: vectorSource });
    map.addLayer(vectorLayer);

    const loadZipCodeCoordinates = async () => {
      const response = await fetch('/georgia_longitude_and_latitude.csv');
      const text = await response.text();
      const rows = text.trim().split('\n');
      const headers = rows[0].split(',');
      const zipIndex = headers.indexOf('Zip');
      const latIndex = headers.indexOf('Latitude');
      const lonIndex = headers.indexOf('Longitude');
      const zipCodeCoords = {};

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(',');
        const zip = row[zipIndex + 1].trim();
        const lat = parseFloat(row[latIndex + 1]);
        const lon = parseFloat(row[lonIndex + 1]);
        zipCodeCoords[zip] = [lon, lat];
      }
      return zipCodeCoords;
    };

    const addMarkers = async () => {
      const zipCodeCoords = await loadZipCodeCoordinates();

      for (let zipCode in zip_code_dct) {
        if (Number(zipCode) !== 0 && !isNaN(Number(zipCode))) {
          const count = zip_code_dct[zipCode];
          const coords = zipCodeCoords[zipCode];
          if (coords) {
            const feature = new Feature({
              geometry: new Point(fromLonLat(coords)),
              count,
              zip: zipCode,
            });
            feature.setStyle(
              new Style({
                image: new CircleStyle({
                  radius: 3 + count / 50,
                  fill: new Fill({ color: 'rgb(201, 176, 22)' }),
                  stroke: new Stroke({ color: 'rgb(110, 44, 111)', width: 1 })
                })
              })
            );
            vectorSource.addFeature(feature);
          }
        }
      }
      // Create tooltip element
const tooltipElement = document.createElement('div');
tooltipElement.style.position = 'absolute';
tooltipElement.style.background = 'rgb(201, 176, 22)';
tooltipElement.style.padding = '6px';
tooltipElement.style.borderRadius = '4px';
tooltipElement.style.border = '1px solid rgb(201, 176, 22)';
tooltipElement.style.color = 'rgb(110, 44, 111)';
tooltipElement.style.fontSize = '12px';
tooltipElement.style.pointerEvents = 'none';
tooltipElement.style.display = 'none';
tooltipElement.style.zIndex = 1000;
document.body.appendChild(tooltipElement);

map.on('pointermove', (event) => {
  const pixel = map.getEventPixel(event.originalEvent);
  const feature = map.forEachFeatureAtPixel(pixel, f => f);

  if (feature) {
    const zip = feature.get('zip');
    const count = feature.get('count');

    const match = demograph.find(item => item['Zip Code'] === zip);
    const schoolname = match?.["School Name"] || 'Unknown';

    tooltipElement.innerHTML = `
      <strong>Zip Code:</strong> ${zip}<br/>
      <strong>School Name:</strong> ${schoolname}<br/>
      <strong>Count:</strong> ${count}
    `;
    tooltipElement.style.left = `${event.originalEvent.pageX + 10}px`;
    tooltipElement.style.top = `${event.originalEvent.pageY + 10}px`;
    tooltipElement.style.display = 'block';
  } else {
    tooltipElement.style.display = 'none';
  }
});


      map.on('singleclick', (event) => {
        const pixel = map.getEventPixel(event.originalEvent);
        const feature = map.forEachFeatureAtPixel(pixel, f => f);

        if (feature) {
          const zipCode = feature.get('zip');
          const city = demograph.find(item => item['Zip Code'] === zipCode)?.City || 'Unknown';
          const exitTicketData = demograph.filter(item => item['Zip Code'] === zipCode);

          const genderData = exitTicketData.reduce((acc, curr) => {
            acc[curr['Gender']] = (acc[curr['Gender']] || 0) + 1;
            return acc;
          }, {});

          const raceData = exitTicketData.reduce((acc, curr) => {
            acc[curr['Gender/Ethnicity']] = (acc[curr['Gender/Ethnicity']] || 0) + 1;
            return acc;
          }, {});

          setHoveredFeature({ zipCode, city, exitTicketData, genderData, raceData });
        } else {
          setHoveredFeature(null);
        }
      });
    };

    addMarkers();

    return () => {
      map.setTarget(null);
    };
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
    renderChart(genderChartRef, Object.keys(genderData), Object.values(genderData));
    renderChart(raceChartRef, Object.keys(raceData), Object.values(raceData));
  }, [hoveredFeature]);

  // Static city chart (right side)
  useEffect(() => {
    if (!demograph.length) return;

    const city_dct = {};
    demograph.forEach(item => {
      city_dct[item['City']] = (city_dct[item['City']] || 0) + 1;
    });

    const cityLabels = Object.keys(city_dct).filter(c => c !== 'Unknown');
    const cityData = cityLabels.map(label => city_dct[label]);

    const ctx = document.getElementById('cityChart')?.getContext('2d');
    if (!ctx) return;

    if (cityChartInstanceRef.current) {
      cityChartInstanceRef.current.destroy();
    }

    cityChartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: cityLabels,
        datasets: [{
          label: 'Student Count',
          data: cityData,
          backgroundColor: '#6e2c6f',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Student Demographics by City' }
        }
      }
    });
  }, [demograph]);

  return (


      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{position: 'absolute', top: '10px', left: '10px', zIndex: 1001}}>
          <img src="/logo.png" alt="Logo" style={{height: '60px'}}/>
        </div>
        <div className='centerTitle'><h1>Key Insights for 2025</h1></div>
        <div style={{marginTop: '1rem', color: 'rgb(110, 44, 111)'}}>
          <button className="dataButton" onClick={() => router.push('/view-data')}>View Data</button>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>

          <div style={{width: '70%', padding: '1rem'}}>
            <div ref={mapRef} style={{
              height: '400px', width: '100%', border: '3px solid rgb(201, 176, 22)'
            }}></div>

          </div>

          {hoveredFeature && (
              <div style={{width: '80%', padding: '1rem'}}>
                <div className='graphTitle'>
                  <h3>Exit Ticket Count for {hoveredFeature.zipCode} ({hoveredFeature.city})</h3>
                </div>
                <div style={{marginBottom: '1rem'}}>
                  <canvas ref={exitTicketChartRef} width="400" height="200"/>
                </div>
              </div>
          )}
        </div>

        <div style={{width: '100%', padding: '1rem', border: '3px solid rgb(201, 176, 22)'}}>
          <div className='graphTitle'>
            <h3>Student Demographics by City</h3></div>
          <canvas id="cityChart" width="800" height="300"></canvas>

        </div>

        <div style={{width: '100%', padding: '1rem', border: '3px solid rgb(201, 176, 22)'}}>
          <div className='graphTitle'>
            <h3>Before and After Confidence Comparison</h3>
          </div>
          <canvas ref={beforeAfterChartRef} width="800" height="300"/>
        </div>
      </div>
  );

};

export default Home;
