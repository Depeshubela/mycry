import React ,{useState,useContext, useEffect,useRef} from 'react';
import AuthContext from '../components/auth/authContext'
import classNames from 'classnames';
import {apiInstance,apiAuthInstance} from '../components/api/apiSend';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../router/router';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
function backendRegisterConfirm() {
    let { loginUser , error} = useContext(AuthContext);
    const [userEmail,setUserEmail] = useState('');
    const [eyeImg1,setEyeImg1] = useState('/icon/open.png');
    const [eyeImg2,setEyeImg2] = useState('/icon/open.png');
    const [eyeState,setEyeState] = useState([false,false])
    const inputFst = useRef(null);
    const inputSec = useRef(null);
    const navigate = useNavigate();
    const getRegisterEmail = async (e) => {
        const queryParams = new URLSearchParams(window.location.search);
        const v = queryParams.get('v');
        try{
            
            const response = await apiInstance.post('registerConfirm/',{
                urls : v
            });
            const data = response.data;
            // console.log(data)
            setUserEmail(data['registerEmail'])
        }catch(e){
            console.log(e)
        }
    }
    getRegisterEmail()
    
    const changeFst = () => {
        if(!eyeState[0]){
            eyeState[0] = true;
            inputFst.current.type = 'text';
            setEyeImg1('/icon/close.png')
        }else{
            eyeState[0] = false;
            inputFst.current.type = 'password';
            setEyeImg1('/icon/open.png')
        }
        
    }
    const changeSec = () => {
        if(!eyeState[1]){
            eyeState[1] = true;
            inputSec.current.type = 'text';
            setEyeImg2('/icon/close.png')
        }else{
            eyeState[1] = false;
            inputSec.current.type = 'password';
            setEyeImg2('/icon/open.png')
        }
    }

    const registerUser = async (e) => {
        e.preventDefault()
        if(inputFst.current.value != inputSec.current.value){
            inputSec.current.setCustomValidity('請確認密碼相同');
            inputSec.current.reportValidity();
            return
        }
        try{
            const response = await apiInstance.post('registerCreateUser/',{
                email:userEmail,
                password:inputFst.current.value
            });
            const data = response.data;
            if(!data['error']){
                withReactContent(Swal).fire({
                    title: `註冊成功`,
                    icon:'success',
                    background: '#FFF5E9',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: '確認',
                  })
                  .then((res)=>{
                    if(res.isConfirmed){
                        navigate(ROUTES.MCC_BACK_LOGIN)
                    }
                  })
            }else{
                withReactContent(Swal).fire({
                    title: `註冊失敗`,
                    icon:'error',
                    background: '#FFF5E9',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: '確認',
                  })
                  .then((res)=>{
                    if(res.isConfirmed){
                        navigate(ROUTES.MCC_BACK_LOGIN)
                    }
                  })
            }
            
            
        }catch(e){
            console.log(e)
        }
    }
    const checkInputSame = () => {
        if(inputFst.current.value != inputSec.current.value){
            inputSec.current.classList.add('border-red-500')
        }else{
            inputSec.current.classList.remove('border-red-500')
            inputSec.current.setCustomValidity('');
            inputSec.current.reportValidity();
        }    }
    

    return (
        <div className='h-screen'>
            <div className='h-full bg-[#f9f5ef]'>
                <div className='h-[50%] flex items-center'>
                    <div className='w-full flex justify-center'>
                        <img src='/icon/mycry/mycrylogo.png'></img>
                    </div>
                </div>
                
                <div className='h-[50%]'>
                    <form onSubmit={registerUser}>
                        <div className={classNames('container flex absolute inset-x-0 m-auto justify-evenly bottom-[40%]')}>
                             <p>{error && error}</p>
                        </div>

                        <div className={classNames('container flex flex-col absolute inset-x-0 m-auto justify-center items-center bottom-[35%]')}>
                            <div className='flex w-full justify-center items-center '>
                                <div className='flex w-full justify-center items-center '>
                                    <input 
                                        
                                        name='userEmail' 
                                        id='userEmail' 
                                        size="30"
                                        value={userEmail}
                                        readOnly
                                        className={classNames('outline-none border-b border-[#49cb71] bg-[#f9f5ef] text-center')}/>
                                </div>
                            </div>
                            <div className='flex w-full justify-center items-center  mt-4'>
                                <div className='flex w-full justify-center items-center '>
                                    <div className='w-[20%]'>
                                        <label htmlFor='inputPassword' className={classNames('font-["unset"] text-[30px] text-[#49cb71] select-none')}>請輸入您的密碼:</label>
                                    </div>
                                    <div className=''>
                                        <input 
                                            ref={inputFst}
                                            name='inputPassword'
                                            type='password'
                                            id='inputPassword' 
                                            size="30"
                                            onInput={checkInputSame}
                                            className={classNames('outline-none border-b border-[#49cb71] bg-[#f9f5ef]')}/>
                                    </div>
                                    <div className='w-[10%]'>
                                        <button type='button' onClick={changeFst} className='w-[50%]'><img src={eyeImg1}></img></button>
                                    </div>
                                </div>
                            </div>
                            <div className='flex w-full justify-center items-center '>
                                <div className='flex w-full justify-center items-center '>
                                    <div className='w-[20%]'>
                                        <label htmlFor='checkPassword' className={classNames('font-["unset"] text-[30px] text-[#49cb71] select-none')}>請再次輸入您的密碼:</label>
                                    </div>
                                    <div className=''>
                                        <input 
                                            ref={inputSec}
                                            name='checkPassword'
                                            type='password'
                                            id='checkPassword' 
                                            size="30"
                                            onInput={checkInputSame}
                                            className={classNames('outline-none border-b border-[#49cb71] bg-[#f9f5ef]')}/>
                                    </div>
                                    <div className='w-[10%]'>
                                        <button type='button' onClick={changeSec} className='w-[50%]'><img src={eyeImg2}></img></button>
                                    </div>
                                </div>      
                            </div>
                        </div>
                        <div className={classNames('container flex absolute inset-x-0 m-auto justify-evenly bottom-[20%] h-[4%]')}>
                            <div className='flex w-2/4 justify-evenly items-center '>
                                <div className='h-full w-2/12'>
                                        <button className={classNames('mr-12 border-0 outline-0 h-full w-full bg-[#ad00ff] text-white border-solid border-black border-t border-l border-r-[3px] border-b-2 rounded-lg')} type='submit'>送出</button>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
                
            </div>
        </div>
    );
}

export default backendRegisterConfirm;
