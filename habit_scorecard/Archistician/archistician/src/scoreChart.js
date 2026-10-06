import { LineChart } from '@mantine/charts';
import '@mantine/charts/styles.css';
import { useEffect, useState } from 'react';


function ScoreChart() {
  const [scores, setScores] = useState([]);
  useEffect(() => {
        fetch("http://localhost:5000/scores/10", { /*Line graph in home always displays 10 most recent scores*/
          credentials: "include"   
        })
          .then(res => res.json())
          .then(data => {
            setScores(data);
            console.log(data)
          })
          .catch(err => console.error("Sorry,", err)); /*To display any error that occured in the console*/
      }, []);

  return (
    <div style={{ width: '100%' }}>
      <LineChart
        w='90%'
        h={300}
        data={scores}
        dataKey="score_added"
        series={[{ name: 'score', label: 'Score' }]}
        curveType="linear"
      />
    </div>
  );

}

export default ScoreChart;