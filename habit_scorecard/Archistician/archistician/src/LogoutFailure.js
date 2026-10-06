/* Page that is rendered when logout fails */
import { Paper } from '@mantine/core'; /* Using the mantine paper component*/
import { IconX } from '@tabler/icons-react';
import {Link} from 'react-router-dom'
import { useParams } from 'react-router-dom';


const LogoutFailure = () => {
  const { error } = useParams(); /*To Save the error that was passed*/

  return (
    <Paper shadow="md" radius="lg" withBorder p="xl" w="40%" h="15%" mt='1.5rem' ta="center">
        <IconX
            size="3rem" 
            color="red" /*Red color for error*/
            strokeWidth={3}  
        />  
        <h2 style={{color: "red"}}>Error</h2>
        <p>Failed to logout</p>
        <p>{error}</p>
        <Link to="/" style={{color: 'blue'}}>Go to Home</Link>
    </Paper>
  )
}

export default LogoutFailure