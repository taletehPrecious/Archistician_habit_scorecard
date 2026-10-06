import {useEffect, useState} from 'react';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';

const IdeaDetails = () => {

    const { id } = useParams();  /*to extract the id parameter (route parameter) from the URL*/
    const history = useHistory(); /*to programmatically navigate the user after deletion*/
    const [idea, setIdea] = useState(null);
    const [error, setError] = useState('');
    
    useEffect(() => {
        fetch("http://localhost:5000/ideas/" + id, { /*fetch specific idea by default Get method*/
        credentials: "include"   
        })
        .then(res => res.json())
        .then(data => {
            setIdea(data);
            console.log(data);
        })
        .catch(err => console.log("Sorry:" + err.message)); /*To display any error that occured in the console*/
    }, [id]);

    const handleClick = () => {
        fetch('http://localhost:5000/ideas/' + id, {
            method: 'DELETE',
            credentials: 'include'
        }).then(() => {
            history.push('/ideas'); /*redirects to idea page after deletion*/
        })
    }

    return (
    <>
    <div className="othercontent" style={{maxWidth: '80%', alignSelf: 'flex-start'}}>
        <div className="blog-details">
            {/* Only display details when habit has been fetched */}
            {idea && (
            <article>
                <h2>{ idea.idea_name}</h2>
                <p> Added: { idea.idea_added }</p>
                <div>{ idea.idea_description }</div>
                <button onClick={handleClick}>Delete</button>
            </article>
            )}
        </div>
    </div>
    </>
    )
}
export default IdeaDetails;
