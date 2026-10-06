import { Paper } from '@mantine/core'; /* Using the mantine paper component*/
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';

const DisplayScore = () => {

  const { score } = useParams(); /*To Save the use parameter that was passed*/
  const [error, setError] = useState('');


    /*post score to the scores table*/
  useEffect(() => {
    const postScore = async () => {
      try {
        const response = await fetch('http://localhost:5000/scores', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify({ score: Number(score) }) /* make sure score is a number */
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Score posting failed');
        }
      } catch (err) { /* Catch any error from the posting process */
        setError('Oops, ' + err.message); /* Store the error message in the error variable */
        console.log(err)
      }
    };

    postScore();
  }, [score]); /* run once score arrives */


  return (
    <>
        <div
        style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
        >   
            <Paper shadow="md" radius="lg" withBorder p="xl" w="50%" h="30%" mt='5rem' ta="center">
                <p style={{color: 'red'}} >{error}</p> {/* Display any error that was caught*/}
                <h2 style={{color: 'blue'}}>Your Score</h2> 
                <h1>{score}</h1>
                <Link to="/habitReport" style={{color: 'blue'}}>Go back to scorecard?</Link>
            </Paper>
        </div>
    </>
  )
}

export default DisplayScore
