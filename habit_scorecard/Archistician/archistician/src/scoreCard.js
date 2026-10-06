import { useForm } from '@mantine/form';
import { Button, Center, Checkbox, Stack } from '@mantine/core';
import {useHistory, Link} from 'react-router-dom';
import { useState, useEffect } from 'react';



function ScoreCard() {
  const history = useHistory();

  const [habits, setHabits] = useState([]);

    useEffect(() => {
      fetch("http://localhost:5000/habits", { /*fetch all habits by default Get method*/
        credentials: "include"   
      })
        .then(res => res.json())
        .then(data => {
          setHabits(data);
        })
        .catch(err => console.error("Sorry,", err)); /*To display any error that occured in the console*/
    }, [habits]); /*re-run everytime habits changes so that changes like delete are reflected*/

  const form = useForm({
    initialValues: {
      habits: [],
    },
  });

  function handleSubmit(values) {
    /* Convert selected names back into objects */
    const selectedHabits = values.habits.map((name) =>
      habits.find((h) => h.habit_name === name)
    );

    console.log("Selected habit objects:", selectedHabits);

    /*One line Javascript loop to sum scores*/
    const newTotalScore = selectedHabits.reduce((sum, h) => sum + h.habit_value, 0);

    history.push(`/displayScore/${newTotalScore}`); /*dynamic route to pass in and display score*/
    /*Save to database*/
  }

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <h2>Your habit Scorecard for {new Date().toLocaleDateString()}</h2> {/*Include current date in the heading*/}
          <Checkbox.Group {...form.getInputProps('habits', { type: 'checkbox' })}>
              <Stack>          
                {habits.map((h) => (
                  <div key={h.id} className="blog-preview" >
                     {/*dynamic route to specific habit's details*/}
                      <Checkbox label={h.habit_name} value={h.habit_name} />
                        <Link to={`/habits/${ h.id }`} style={{
                          textDecoration: 'underline', 
                          color: 'blue', 
                          fontSize: '0.8rem'
                        }}>
                          See details
                        </Link>
                  </div>
                ))}
              </Stack>
          </Checkbox.Group>

      <div style={{ marginTop: 20 }}>
        <strong>Checked:</strong> {form.values.habits.length}
      </div>

      <Center mt='md'>
        <Button color='green' variant='light' w='80%' type="submit">Submit</Button>
      </Center>
      </form>      
      </>
  );
}

export default ScoreCard;