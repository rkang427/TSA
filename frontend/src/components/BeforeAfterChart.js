"use client";
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
 const questionKeywords = {
    // "Before the session, how many scholarship applications did you submit?": 'Scholarship Apps Submitted',
    // "After the session, how many scholarship applications have you submitted?": 'Scholarship Apps Submitted',
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
 const questions = [
    // "Before the session, how many scholarship applications did you submit?", // for another pillar
    // "After the session, how many scholarship applications have you submitted?",
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
const BeforeAfterChart = ({ beforeAfterData }) => {
  const beforeAfterChartRef = useRef(null);

  useEffect(() => {
  if (!beforeAfterData.length) return;

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
    if (beforeAfterChartRef.current.chart) {
      beforeAfterChartRef.current.chart.destroy();
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
  return (
    <div style={{ width: '100%', padding: '1rem', border: '3px solid rgb(201, 176, 22)' }}>
      <h3 className="graphTitle">Before and After Confidence Comparison</h3>
      <canvas ref={beforeAfterChartRef} width="300" height="300" />
    </div>
  );
};

export default BeforeAfterChart;
