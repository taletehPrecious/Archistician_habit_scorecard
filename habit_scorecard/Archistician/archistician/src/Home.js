import { useState, useEffect} from 'react';
import Card1 from './card'; 
import ScoreChart from './scoreChart';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const Home = () => {
    const [user, setUser] = useState('');
    const [error, setError] = useState('');
    const[namePending, setNamePending] = useState(true);
    
    useEffect(() => {
      fetch("http://localhost:5000/session", { /* Send get request to /session endpoint to get username */
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          if (data.authenticated) {
            setUser(data.user);   /* user = { id:'', username:'' }*/
          } else {
            setError("Not logged in");
          }
          setNamePending(false);
        })
        .catch(err => setError("Error: " + err.message)); /* Catch error from process */
    }, []);


    return (
        <div className="home">
            <div className="usercard">
             { !namePending? <Card1 username={user.username}/> : <Card1 username='Loading...'/>}
            </div>
            
            <div className="sidecontent">
              <div className="othercontent" style={{textAlign: 'center'}}>
                <h2>Your Habit Progress</h2>
                <ScoreChart /> {/* Display scoreChart component */}
              </div>

              {/* Div links to habit page */}
              <Link style={{textDecoration: 'none'}} to='/habitReport'>
                <div className="othercontent">
                    <h2 style={{color: 'blue'}}>See your Habit Scorecard</h2>
                </div>
              </Link>

              {/* Div links to idea page */}
              <div className="othercontent">
              <Link style={{textDecoration: 'none'}} to='/ideas'>
                <h2>See your Awesome Ideas</h2>
              </Link>
              </div>
            </div>
        </div>
      );
}
 
export default Home;
