/*signup.js*/

import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PasswordControl from './PasswordControl';
import { Link } from 'react-router-dom';
import { Input, Paper } from '@mantine/core';
/* Passwords are hashed server-side and cookies are used for session management */
 
 const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const history = useHistory(); //used to programmatically navigate the user i.e to redirect after form submission

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents default refresh behaviour of the browser when form is submitted
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!username) {
        throw Error('Missing username');
    }
    const user = { username, password };

    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(user)
      });

      if (response.ok) {
        console.log('User created successfully');
        history.push('/login'); //redirects to login after user is added
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Signup failed');
      }
    } catch (err) { /*catch any error from signup process*/
      setError('Sorry,' + err.message); /*display Error*/
    }
  }

  return (
    <div className="create"> {/*reusing create styling*/}
      <Paper shadow="md" radius="lg" withBorder p="xl" w="100%" h="30%" mt='1.5rem' ta="center">
        <h2>Sign Up</h2>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <form onSubmit={handleSubmit}>

            <Input 
              type="text" 
              required 
              autoFocus
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} /*updates username state whenever input changes*/
            />

            <PasswordControl
              value={password}
              onChange={(e) => setPassword(e.target.value)} /*updates password state whenever input changes*/

            />

            <Input 
              type="password"
              required 
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              mt={30}
            />

            <button>Sign up</button>
            <Link to={`/login`} style={{ color: 'blue' }}>
                  <p style={{ color: 'blue' }}>Already have an account? Login instead</p>
            </Link>
        </form>
      </Paper>
    </div>
  )
}

export default Signup;