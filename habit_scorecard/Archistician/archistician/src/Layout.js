/*For conditional rendering of the navbar*/  

import { useLocation } from 'react-router-dom';
import Navbar from './navbar';
import { AppShell, Footer, Text } from '@mantine/core';

const Layout = ({ children }) => {
  const location = useLocation();

  /* Paths where the Navbar should be hidden */
  const pathsWithoutNavbar = ['/login', '/signup', '/logout', '/logoutFailure/:error', '/logoutSuccess'];
  
  /* check if the current path is NOT in our restricted list. */
  const showNavbar = !pathsWithoutNavbar.includes(location.pathname);

  return (
    
    <div className="layout" style={{textAlign: 'center'}}>
      {showNavbar && <Navbar />}
      <div className="content">
          {children}
      </div>
        <p>© 2025 Archistician — All Rights Reserved</p> {/* display footer */}
    </div>
  
  );
};

export default Layout;
