import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Input } from '@mantine/core';
import { useContext } from 'react';
import checkedAuthContext from './checkedAuthContext';
import AuthContext from './authContext';
import { Paper } from '@mantine/core'; /* Using the mantine paper component*/

// Send raw password to server so it can verify and set a session cookie
 
 const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const { checkedAuth, setCheckedAuth } = useContext(checkedAuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const history = useHistory(); //used to programmatically navigate the user i.e to redirect after form submission

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents default refresh behaviour of the browser when form is submitted
    
    if (!username) {
        throw Error('Missing username'); /*Throw error if username is missing*/
    }

    if (!password) {
        throw Error('Missing username');
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        console.log('User logged in successfully');
        /* After login, fetch session to update auth state */
        const sessionRes = await fetch("http://localhost:5000/session", {
          credentials: "include"
        });
        const session = await sessionRes.json();
        setAuth({
          authenticated: session.authenticated,
          user: session.user
        });
        history.push('/'); //redirects to home after login is added
        setCheckedAuth(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed');
      }
    } catch (err) { /*catch any error from login process*/
      setError('Sorry,' + err.message); /*display Error*/
    }
  }

  return (
    <div className="create"> {/*reusing create styling*/}
      <Paper shadow="md" radius="lg" withBorder p="xl" w="100%" h="30%" mt='1.5rem' ta="center">
          <h2>Log In</h2>
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

              <Input 
                type="password"
                required 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                mt={30}
              />

              <button>Log in</button>

              <Link to={`/signup`} style={{ color: 'blue' }}>
                  <p style={{ color: 'blue' }}>Don't have an account? Sign up instead</p>
              </Link>
          </form>
        </Paper>
    </div>
  )
}

export default Login;

