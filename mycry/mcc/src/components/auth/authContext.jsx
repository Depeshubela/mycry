import React,{ createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import {apiInstance} from '../api/apiSend';
import ROUTES from '../../router/router';

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [user, setUser] = useState(() => (localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null))
    let [authTokens, setAuthTokens] = useState(() => (localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null))

    const [error, setError] = useState(null);
    // console.log('auth')
    const navigate = useNavigate()
    let loginUser = async (e) => {
        e.preventDefault()
        // console.log("login")
        try {
            
            const response = await apiInstance.post('token/', {
                email: e.target.loginEmail.value,
                password: e.target.loginPassword.value
            });
            const data = response.data;
            // console.log(response)
            
            if (data) {
               
                localStorage.setItem('authTokens', JSON.stringify(data));
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                setError(null);
                navigate(ROUTES.MCC_BACK_MAIN);
                
            } else {
                setError('登入失敗：請確認帳號或密碼是否正確'); 
            }
        } catch (errors) {
            console.log(errors)
            e = errors.response ? errors.response.data.error : errors.message
            setError(`登入失敗：${e}`);
        }
    }

    const logoutUser = () => {
        localStorage.removeItem('authTokens');
        setAuthTokens(null);
        setUser(null);
        navigate(ROUTES.MCC_BACK_LOGIN);
    };
    
    const handleLogout = (e) => {
        e.preventDefault();
        logoutUser();
    };

    const updateToken = async () => {
        // console.log("update")

        try{
            const response = await apiInstance.post('token/refresh/', {
                refresh: authTokens?.refresh
               }, {
                   headers: {
                       'Content-Type': 'application/json'
                   }
               });
       
               const data = response.data;
       
               if (response.status === 200) {
                    
                   setAuthTokens(data)
                   setUser(jwtDecode(data.access))
                   localStorage.setItem('authTokens',JSON.stringify(data))
                   console.log('token update successfully:');
               } else {
                   console.log('token update error:');
                   logoutUser()
               }
        }catch{
            if(authTokens){
                logoutUser()
            }

        }
        
    }

    let contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
        handleLogout,
        error,
        updateToken
    }

    useEffect(()=>{
        if(authTokens){
            const REFRESH_INTERVAL = 1000 * 300
            let interval = setInterval(()=>{
                if(authTokens){
                    updateToken()
                }
            }, REFRESH_INTERVAL)
            return () => clearInterval(interval)
        }
    },[authTokens])

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}