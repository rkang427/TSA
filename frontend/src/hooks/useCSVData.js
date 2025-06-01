import { useState, useEffect } from 'react';
import Papa from 'papaparse';

const useCSVData = (url) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(url)
      .then(res => res.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: header =>
            header.trim().replace(/\s+/g, ' '),
          complete: (results) => {
            setData(results.data);
          },
        });
      })
      .catch(err => console.error(`Error fetching ${url}:`, err));
  }, [url]);

  return data;
};

export default useCSVData;
