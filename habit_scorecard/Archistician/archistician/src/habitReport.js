import ScoreCard from "./scoreCard"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {Center, Button } from "@mantine/core";

const HabitReport = () => {
  const history = useHistory();

  const handleClick = () => { /* Function to redirect to addHabit page */
      history.push('/addHabit');
  }
  return (

      <div className="othercontent" style={{maxWidth: '80%'}}>
        <ScoreCard />
        <Center mt="md">
          <Button color='#299154' w='80%'onClick={handleClick} >Add habit</Button>
        </Center>
      </div>
    
  )
}

export default HabitReport;


