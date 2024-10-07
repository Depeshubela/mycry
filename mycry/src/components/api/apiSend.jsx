import axios from 'axios'
import {jwtDecode} from 'jwt-decode';

export const apiInstance = axios.create({
    baseURL: 'http://18.180.184.82/api/',
    // baseURL: 'http://localhost:8000/',
    headers:{
        'Content-Type':'application/json',
        Accept:'application/json',
    }
})

export const apiAuthInstance = axios.create({
    baseURL: 'http://18.180.184.82/api/',
    // baseURL: 'http://localhost:8000/',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
});

//攔截每個API並檢查是否過期及導入Bearer
apiAuthInstance.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('authTokens');

    if (token) {
        const decodedToken = jwtDecode(JSON.parse(token).access);
        const currentTime = Math.floor(Date.now() / 1000);

        // 檢查 token 是否過期
        if (decodedToken.exp < currentTime) {
            return Promise.reject('Token 已過期');
        } else {
            config.headers['Authorization'] = 'Bearer ' + JSON.parse(token).access;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});