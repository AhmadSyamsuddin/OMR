import axios from 'axios';
import React, { useEffect } from 'react'

export default function ProgramsPage() {
    const [programs, setPrograms] = React.useState([]);

    async function fetchPrograms() {
        try {
            const response = await axios.get('http://localhost:3000/exercises', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log(response.data);
            
            setPrograms(response.data);
        } catch (error) {
            console.error("Error fetching programs:", error);
        }
    }

    useEffect(() => {
        fetchPrograms();
    }, []);
  return (
    <div>ProgramsPage</div>
  )
}
