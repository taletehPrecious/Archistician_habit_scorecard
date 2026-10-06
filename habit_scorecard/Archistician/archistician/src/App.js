import '@mantine/core/styles.css'; /* because I am using mantine components for my project */
/* import all required components */
import Home from './Home';
import Create from './create';
import NotFound from './NotFound';
import Signup from './signup';
import Login from './login';
import Layout from './Layout';
import CheckedAuthContext from "./checkedAuthContext";
import AuthContext from "./authContext";
import HabitReport from './habitReport';
import DisplayScore from './displayScore';
import LogoutSuccess from './LogoutSuccess';
import LogoutFailure from './LogoutFailure';
import Ideas from './Ideas';
import AddHabit from './addHabit';
import IdeaDetails from './ideaDetails';
import HabitDetails from './habitDetails';
import Finance from './finance'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createTheme, MantineProvider } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

const theme = createTheme({
  /* I plan to add a Mantine theme here */
});

function App() { /* Check if user is logged in */
  const [auth, setAuth] = useState({ authenticated: false, user: null });
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => { /* This funtion checks if user is authenticated */
    (async () => {
      try {
        /* Sends GET request to the /session endpoint */
        const res = await fetch('http://localhost:5000/session', { credentials: 'include' });
        const data = await res.json();
        setAuth({ authenticated: !!data.authenticated, user: data.user || null });
        setCheckedAuth(true);
      } catch (err) {
        setAuth({ authenticated: false, user: null });
        setCheckedAuth(true); 
      } 

    })();
  }, []); 


  return (
    <MantineProvider theme={theme}> {/* Wrapping app with Mantine provide inorder to apply Mantine themes */}
      <AuthContext.Provider value={{ auth, setAuth }}> {/* Provide authentication and checkedAuth state to the app */}
        <CheckedAuthContext.Provider value={{ checkedAuth, setCheckedAuth }}>
          <Router>
            <Layout> {/* Wrapping routes with Layout to conditionally render the Navbar */}
                <Switch>
                  <Route exact path="/signup">
                    <Signup />
                  </Route>
                  <Route exact path="/login">
                    <Login />
                  </Route>
                  <Route path="/logout"> 
                  {/* For the following pages, if authentication has been verified show page, 
                  if user is not authenticated, redirect to login If authentication 
                  has not been checked yet, show Loading... */}
                    {checkedAuth ? (auth.authenticated ? <Create /> : <Redirect to="/login" />) : <div>Loading...</div>} {/*Redirect to login page if user is not authenticated*/}
                  </Route>
                   <Route exact path="/">
                    {checkedAuth ? (auth.authenticated ? <Home /> : <Redirect to="/login" />) : <div>Loading...</div>}
                  </Route>
                  <Route exact path="/habitReport">
                    {checkedAuth ? (auth.authenticated ? <HabitReport /> : <Redirect to="/login" />) : <div>Loading...</div>}
                  </Route>
                  <Route path="/addHabit">
                    {checkedAuth ? (auth.authenticated ? <AddHabit /> : <Redirect to="/login" />) : <div>Loading...</div>}
                  </Route>
                  <Route path="/create">
                    {checkedAuth ? (auth.authenticated ? <Create /> : <Redirect to="/login" />) : <div>Loading...</div>}
                  </Route>
                  <Route exact path="/ideas">
                    {checkedAuth ? (auth.authenticated ? <Ideas /> : <Redirect to="/login" />) : <div>Loading...</div>}
                  </Route>
                  <Route exact path="/habits/:id"> {/*Dynamic route to allow display of different habit details*/}
                    {checkedAuth ? (auth.authenticated ? <HabitDetails /> : <Redirect to="/login" />) : <div>Loading...</div>}
                  </Route>
                  <Route exact path="/ideas/:id">
                    {checkedAuth ? (auth.authenticated ? <IdeaDetails /> : <Redirect to="/login" />) : <div>Loading...</div>}
                  </Route>
                  <Route path="/finance">
                    {checkedAuth ? (auth.authenticated ? <Finance /> : <Redirect to="/login" />) : <div>Loading...</div>}
                  </Route>
                  <Route path="/displayScore/:score"> {/* displayScore will accept score as parameter*/}
                    {checkedAuth ? (auth.authenticated ? <DisplayScore /> : <Redirect to="/login" />) : <div>Loading...</div>}
                  </Route>
                  <Route path="/logoutFailure/:error"> {/*logoutFailure will accept error as parameter*/}
                    <LogoutFailure />
                  </Route>
                  <Route path="/logoutSuccess"> 
                    <LogoutSuccess />
                  </Route>
                  <Route path="*">
                    <NotFound />
                  </Route>
                </Switch>
            </Layout>
          </Router>
        </CheckedAuthContext.Provider>
      </AuthContext.Provider>

    </MantineProvider>
  );
}

export default App;