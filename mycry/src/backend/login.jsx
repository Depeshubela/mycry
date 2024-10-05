import React ,{useState,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../router/router';
import AuthContext from '../components/auth/authContext'
import classNames from 'classnames';

function backendLogin() {
    let { loginUser,error } = useContext(AuthContext);
    const navigate = useNavigate();
    // console.log("AAA")

    return (
        <div className='h-screen'>
            <div className='h-full bg-[#f9f5ef]'>
                <div className='h-[50%] flex items-center justify-center'>
                    <div className='w-3/12 flex justify-center'>
                        <img src='/icon/mycry/mycrylogo.png'></img>
                    </div>
                </div>
                
                <div className='h-[50%]'>
                    <form onSubmit={loginUser}>
                        <div className={classNames('container flex absolute inset-x-0 m-auto justify-evenly bottom-[40%]')}>
                            {error && <p>{error}</p>}
                        </div>

                        <div className={classNames('container flex absolute inset-x-0 m-auto justify-evenly bottom-[35%]')}>
                            <div className='flex w-[70%] justify-evenly items-center '>
                                <div className=''>
                                    <label htmlFor='loginEmail' className={classNames('font-["unset"] text-[30px] text-[#49cb71] select-none')}>EMAIL:</label>
                                    <input 
                                        name='loginEmail' 
                                        id='loginEmail' 
                                        size="20" 
                                        autoComplete="email"
                                        className={classNames('outline-none border-b border-[#49cb71] bg-[#f9f5ef]')}/>
                                </div>
                                
                                <div className=''>
                                    <label htmlFor='loginPassword' className={classNames('font-["unset"] text-[30px] text-[#49cb71] select-none')}>PASSWORD:</label>
                                    <input 
                                        type='password' 
                                        name='loginPassword' 
                                        id='loginPassword' 
                                        size="20" 
                                        autoComplete="current-password"
                                        className={classNames('outline-none border-b border-[#49cb71] bg-[#f9f5ef]')}/>
                                </div>
                            </div>
                        </div>
                        
                        <div className={classNames('container flex absolute inset-x-0 m-auto justify-evenly bottom-[20%] h-[4%]')}>
                            <div className='flex w-2/4 justify-evenly items-center '>
                                <div className='h-full w-2/12'>
                                        <button className={classNames('mr-12 border-0 outline-0 h-full w-full bg-[#ad00ff] text-white border-solid border-black border-t border-l border-r-[3px] border-b-2 rounded-lg')} type='submit'>登入</button>
                                </div>
                                
                                <div className='h-full w-2/12'>
                                    <button className={classNames('mr-12 border-0 outline-0 h-full w-full bg-[#ad00ff] text-white border-solid border-black border-t border-l border-r-[3px] border-b-2 rounded-lg')} type='button' onClick={()=>navigate(ROUTES.MCC_BACK_REGISTER)}>註冊</button>
                                </div>

                                <div className='h-full w-2/12'>
                                    <button className={classNames('mr-12 border-0 outline-0 h-full w-full bg-[#ad00ff] text-white border-solid border-black border-t border-l border-r-[3px] border-b-2 rounded-lg')} type='button' onClick={()=>navigate(ROUTES.MCC_FOX_MAIN)}>小狐狸模式</button>
                                </div>

                                <div className='h-full w-2/12'>
                                    <button className={classNames('mr-12 border-0 outline-0 h-full w-full bg-[#ad00ff] text-white border-solid border-black border-t border-l border-r-[3px] border-b-2 rounded-lg')} type='button' onClick={()=>navigate(ROUTES.MCC_COPYRIGHT)}>版權聲明</button>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>
                
            </div>
        </div>
    );
}

export default backendLogin;
