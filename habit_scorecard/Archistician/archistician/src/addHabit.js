
 import { useState } from 'react';
 import { useHistory } from 'react-router-dom';
 import { Textarea, Input, NativeSelect } from '@mantine/core';
 
 const AddHabit = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const history = useHistory(); //used to programmatically navigate the user i.e to redirect after form submission

    const handleSubmit = async (e) => {
        e.preventDefault(); //prevents default refresh behaviour of the browser when form is submitted
        
        if (!title || !value ==='' ) {
            setError('Missing title or value'); /*set error if title or value is missing*/
            return; /*Stop the function*/
        }


        try {
        console.log("Submitting:", { title, description, value });
        const response = await fetch('http://localhost:5000/habits', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({ title, description, value })
        });

        if (response.ok) {
            console.log('Habit added successfully');
            history.push('/habitReport'); /*redirects habitReport after habit is added*/
        } else {
            const errorData = await response.json();
            setError(errorData.error || 'Habit posting failed');
        }
        } catch (err) { /*catch any error from login process*/
        setError('Sorry,' + err.message); /*set Error to the caught error*/
        }
    }


  return (
    <div className="create">
        <h2>Add a New Habit</h2>
        <p style={{color: 'red'}}>{error}</p> {/*Display whatever was stored in the error variable*/}
        <form onSubmit={handleSubmit}>
            <Input 
              type="text" 
              placeholder="Title"
              autoFocus
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)} /*updates title state whenever input changes*/
            />


            <NativeSelect
                description="-2:Very undesirable|   -1:unndesirable|   0:Neutral|   1:good|   2:Very good"
                value={value}
                required

                onChange={(e) => setValue(e.currentTarget.value)}
                data={[
                    { value: "", label: "Select a value…" },
                    { value: "-2", label: "-2: Very undesirable" },
                    { value: "-1", label: "-1: Undesirable" },
                    { value: "0",  label: "0: Neutral" },
                    { value: "1",  label: "1: Good" },
                    { value: "2",  label: "2: Very good" }
                ]}
                mt='2rem'
            />

            {/*Is habit very good, bad, very bad? etc.*/ }

            <Textarea
              placeholder="Description"
              value={description}
              mt= {30}
              onChange={(e) => setDescription(e.target.value)} /*updates body state whenever input changes*/
            />


             <button>Add Habit</button>
        </form>
    </div>
  )
}

export default AddHabit;
