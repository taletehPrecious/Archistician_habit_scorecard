/* Page that is rendered when logout succeeds */
import { Paper } from '@mantine/core'; /* Using the mantine paper component*/
import { Link } from 'react-router-dom';
import { IconCheck } from '@tabler/icons-react';


const LogoutSuccess = () => {
  return (
    <>
        <Paper shadow="md" radius="lg" withBorder p="xl" w="40%" h="15%" mt='5rem' ta="center">
            <IconCheck 
                size="3rem" 
                color="green" /*Green color for success*/
                strokeWidth={3} 
            /> 
            <h2>Logged out</h2> 
            <p>Logged out successfully</p>
            <Link to="/login" style={{color: 'blue'}}>Go to Login</Link> {/* Link to login */}
        </Paper>
    </>
  )
}

export default LogoutSuccess