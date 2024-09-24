import { useEffect, useState } from "react";
import useInterval from "./useInterval";

const useFetch = (url, refreshInterval, randomRefresher) => {
    const [data, setData] = useState([]);
  
    const fetchData = async () => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          return {hasError: true, error}
        });
    }
  
    useEffect(() => {
      fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, randomRefresher]);
  
    useInterval(() => {
      if (refreshInterval) {
        //console.debug(refreshInterval);
        fetchData();
      }
    }, refreshInterval);

    return [data, setData];
}

export default useFetch;