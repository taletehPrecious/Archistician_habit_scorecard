import { useState } from 'react';
import { useContext } from 'react';
import CheckedAuthContext from './checkedAuthContext';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';




function Logout() {
    const history = useHistory();
    const { checkedAuth, setCheckedAuth } = useContext(CheckedAuthContext);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const  handleLogout = async () => {
            try {
            const response = await fetch('http://localhost:5000/logout', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                setStatus('success'); /* Make the ui changes */ 
                setCheckedAuth(false);
            } else { /*Handles non-successful responses*/
                const errorData = await response.json();
                setError(errorData.error || 'Logout failed');
            }
            } catch (err) { /*catch any error from logout process*/
                setError('Sorry,' + err.message); /*display Error*/
                setStatus('failure'); /* Make the ui changes */
            }
    };
    useEffect(() => {
        if (status === 'success') {
        history.push('/logoutSuccess');
        }

        if (status === 'failure') {
        history.push(`/logoutFailure/${error}`);
        }
    }, [status, error, history]);

    return (
            <button style={{marginTop: '0'}} onClick={handleLogout}>
                Log Out
            </button>
    );
    };

export default Logout;