import { useEffect, useState } from "react";

const useGetFetch = (API_EndPoint) => {
  const [data, setData] = useState();
  const JWT_TOKEN = localStorage.getItem('token');
  
  useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(API_EndPoint, {
              method: 'GET',
              headers: { Authorization: `Bearer ${JWT_TOKEN}` }
            });
            
            const jsonData = await response.json();
            setData(jsonData.data || []);
          } catch (error) {
            console.log('Error fetching registered products: ' + error);
          }
        };

        fetchData();
  }, [API_EndPoint]);

  return data;
};

export default useGetFetch;