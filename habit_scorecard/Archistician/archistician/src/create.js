 import { useState } from 'react';
 import { useHistory } from 'react-router-dom';
 import { Textarea, Input } from '@mantine/core';
 
 const Create = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();  //used to programmatically navigate the user i.e to redirect after form submission

    const handleSubmit = async (e) => {
        e.preventDefault(); //prevents default refresh behaviour of the browser when form is submitted
        
        if (!title ) {
            setError('Missing title'); /*set error if title or value is missing*/
            return; /*Stop the function*/
        }

        /* Post a new idea */
        try {
        const response = await fetch('http://localhost:5000/ideas', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({ title, description})
        });

        if (response.ok) {
            console.log('Idea added successfully');
            history.push('/ideas'); //redirects habitReporrt after habit is added
        } else {
            const errorData = await response.json();
            setError(errorData.error || 'Idea posting failed');
        }
        } catch (err) { /*catch any error from creation process*/
        setError('Sorry,' + err.message); /*display Error*/
        }
    }

  return (
    <div className="create">
        <h2>Add a New Idea</h2>
        <p style={{color:'red'}}>{error}</p>
        <form onSubmit={handleSubmit}> {/* Call function to add idea when form is submitted */}
            <Input 
              type="text" 
              placeholder="Title"
              autoFocus
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)} /*updates title state whenever input changes*/
            />

            <Textarea
              placeholder="Description"
              value={description}
              mt= {30}
              onChange={(e) => setDescription(e.target.value)} /*updates body state whenever input changes*/
            />

            <button>Add Idea</button>
        </form>
    </div>
  )
}

export default Create;
