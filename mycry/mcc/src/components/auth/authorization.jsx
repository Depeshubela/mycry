// helpers.js
export const addAuthHeader = (config) => {
    const token = localStorage.getItem('authTokens');
    if (token) {
        config.headers.Authorization = 'Bearer ' + String(JSON.parse(token).access);
    }
    return config;
};
