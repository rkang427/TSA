'use client';
import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Circle as CircleStyle, Fill, Style, Stroke } from 'ol/style';

const MapChart = ({ demograph, onFeatureClick }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!demograph.length) return;

    const zipCodeCount = {};
    demograph.forEach(item => {
      zipCodeCount[item['Zip Code']] = (zipCodeCount[item['Zip Code']] || 0) + 1;
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

    const tooltipElement = document.createElement('div');
    Object.assign(tooltipElement.style, {
      position: 'absolute',
      background: 'rgb(201, 176, 22)',
      padding: '6px',
      borderRadius: '4px',
      border: '1px solid rgb(201, 176, 22)',
      color: 'rgb(110, 44, 111)',
      fontSize: '12px',
      pointerEvents: 'none',
      display: 'none',
      zIndex: 1000,
    });
    document.body.appendChild(tooltipElement);

    const loadZipCodeCoordinates = async () => {
      const response = await fetch('/georgia_longitude_and_latitude.csv');
      const text = await response.text();
      const [headersLine, ...lines] = text.trim().split('\n');
      const headers = headersLine.split(',');
      const zipIdx = headers.indexOf('Zip');
      const latIdx = headers.indexOf('Latitude');
      const lonIdx = headers.indexOf('Longitude');

      const coords = {};
      lines.forEach(line => {
        const row = line.split(',');
        const zip = row[zipIdx + 1]?.trim();
        const lat = parseFloat(row[latIdx + 1]);
        const lon = parseFloat(row[lonIdx + 1]);
        if (zip && !isNaN(lat) && !isNaN(lon)) {
          coords[zip] = [lon, lat];
        }
      });
      return coords;
    };

    const addMarkers = async () => {
      const zipCoords = await loadZipCodeCoordinates();
      for (let zip in zipCodeCount) {
        const count = zipCodeCount[zip];
        const coords = zipCoords[zip];
        if (coords) {
          const feature = new Feature({
            geometry: new Point(fromLonLat(coords)),
            zip,
            count
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
    };

    addMarkers();

    map.on('pointermove', event => {
      const feature = map.forEachFeatureAtPixel(event.pixel, f => f);
      if (feature) {
        const zip = feature.get('zip');
        const count = feature.get('count');
        const school = demograph.find(d => d['Zip Code'] === zip)?.['School Name'] || 'Unknown';
        tooltipElement.innerHTML = `<strong>Zip:</strong> ${zip}<br/><strong>School:</strong> ${school}<br/><strong>Count:</strong> ${count}`;
        tooltipElement.style.left = `${event.originalEvent.pageX + 10}px`;
        tooltipElement.style.top = `${event.originalEvent.pageY + 10}px`;
        tooltipElement.style.display = 'block';
      } else {
        tooltipElement.style.display = 'none';
      }
    });

    map.on('singleclick', event => {
      const feature = map.forEachFeatureAtPixel(event.pixel, f => f);
      if (feature) {
        const zip = feature.get('zip');
        const data = demograph.filter(d => d['Zip Code'] === zip);
        const genderData = data.reduce((acc, d) => {
          acc[d['Gender']] = (acc[d['Gender']] || 0) + 1;
          return acc;
        }, {});
        const raceData = data.reduce((acc, d) => {
          acc[d['Gender/Ethnicity']] = (acc[d['Gender/Ethnicity']] || 0) + 1;
          return acc;
        }, {});
        const city = data[0]?.City || 'Unknown';

        onFeatureClick({ zipCode: zip, city, exitTicketData: data, genderData, raceData });
      } else {
        onFeatureClick(null);
      }
    });

    return () => map.setTarget(null);
  }, [demograph]);

  return (
    <div
      ref={mapRef}
      style={{ height: '400px', width: '100%', border: '3px solid rgb(201, 176, 22)' }}
    ></div>
  );
};

export default MapChart;
