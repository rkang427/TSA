import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Home from "@/app/page";
const ExitTicketChart = ({ data }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!data) return;

    const labelMap = data.reduce((acc, curr) => {
      acc[curr['Exit Ticket Name']] = (acc[curr['Exit Ticket Name']] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(labelMap);
    const counts = Object.values(labelMap);

    if (ref.current.chartInstance) {
      ref.current.chartInstance.destroy();
    }

    const ctx = ref.current.getContext('2d');
    ref.current.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: 'Count', data: counts, backgroundColor: 'rgb(201, 176, 22)' }]
      },
      options: { responsive: true }
    });
  }, [data]);

  return (
      <canvas ref={ref} width="400" height="200" />

);
};

export default ExitTicketChart;
