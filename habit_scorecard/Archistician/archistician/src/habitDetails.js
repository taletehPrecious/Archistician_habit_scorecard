import {useEffect, useState} from 'react';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';

const HabitDetails = () => {
    const { id } = useParams();  /*to extract the id parameter (route parameter) from the URL*/
    const history = useHistory(); /*to programmatically navigate the user after deletion*/
    const [habit, setHabit] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch("http://localhost:5000/habits/" + id, { /*fetch habit by default Get method*/
        credentials: "include"   
        })
        .then(res => res.json())
        .then(data => {
            setHabit(data);
        })
        .catch(err => console.log("Sorry:" + err.message)); /*To display any error that occured in the console*/
    }, [id]);

    const handleClick = () => {
        fetch('http://localhost:5000/habits/' + id, {
            method: 'DELETE',
            credentials: 'include'
        }).then(() => {
            history.push('/habitReport'); /*redirects to habit report page after deletion*/
        })
    }

  return (
    <>
    <div className="othercontent" style={{maxWidth: '80%', alignSelf: 'flex-start'}}>
        <div className="blog-details">
            {/* Only display details when habit has been fetched */}
            {habit && ( 
            <article>
                <h2>{ habit.habit_name}</h2>
                <p> Added: { habit.habit_added }</p>
                <p> Value: {habit.habit_value}</p>
                <div>{ habit.habit_description }</div>
                <button onClick={handleClick}>Delete</button>
            </article>
            )}
        </div>
    </div>
    </>
  )
}

export default HabitDetails;

