import axios from 'axios';

const backendData = (url) => {
    return axios.get(url)
        .then((res) => {
            return res;
        })
        .catch((err) => {
            console.error("Error fetching data:", err);
            throw err; 
        });
};

export default backendData;
