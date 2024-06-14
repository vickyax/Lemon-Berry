import { useEffect, useState } from 'react';
import axios from 'axios';

const useUserData = (token) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/userInfo', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the request headers
          },
        });
        setUser(response.data); // Assuming response.data contains user information
        setLoading(false); // Update loading state when data is fetched
      } catch (error) {
        console.error('Error fetching user data', error);
        // Optionally handle error here, e.g., set user to null
      }
    };

    if (token) {
      fetchUserData(); // Fetch user data when token changes
    } else {
      setUser(null); // Clear user data if token is null or undefined
      setLoading(false); // Set loading to false since there's no request
    }
  }, [token]);

  return { user, loading };
};

export default useUserData;
