import React ,{useState,useContext} from 'react';
import AuthContext from '../components/auth/authContext'
import classNames from 'classnames';
import {apiInstance,apiAuthInstance} from '../components/api/apiSend';
function backendRegister() {
    let { loginUser , error} = useContext(AuthContext);
    const [resLog,setResLog] = useState('');
    const registerEmail = async (e) => {
        e.preventDefault()
        try{
            const response = await apiInstance.post('api/register/', {
                email: e.target.registerEmail.value,
            });
            const data = response.data;
            console.log(data)
            setResLog(data['success'] ? data['success'] : data['error'] ? data['error'] : '')
        }catch(e){
            console.log(e)
        }
    }

    return (
        <div className='h-screen'>
            <div className='h-full bg-[#f9f5ef]'>
                <div className='h-[50%] flex items-center'>
                    <div className='w-full flex justify-center'>
                        <img src='/icon/playdogelogo.png'></img>
                    </div>
                </div>
                
                <div className='h-[50%]'>
                    <form onSubmit={registerEmail}>
                        <div className={classNames('container flex absolute inset-x-0 m-auto justify-evenly bottom-[40%]')}>
                             <p>{resLog && resLog}</p>
                        </div>

                        <div className={classNames('container flex absolute inset-x-0 m-auto justify-evenly bottom-[35%]')}>
                            <div className='flex w-[50%] justify-center items-center '>
                                <div className='flex w-full justify-center items-center '>
                                    <label htmlFor='registerEmail' className={classNames('font-["unset"] text-[30px] text-[#49cb71] select-none')}>EMAIL:</label>
                                    <input 
                                        name='registerEmail' 
                                        id='registerEmail' 
                                        size="30" 
                                        className={classNames('outline-none border-b border-[#49cb71] bg-[#f9f5ef]')}/>
                                </div>
                                
                                {/* <div className='w-[50%]'> */}
                                <div className='flex w-full justify-center items-center '>
                                    <div className='h-full'>
                                            <button className={classNames('mr-12 border-0 outline-0 h-full w-full bg-[#ad00ff] text-white border-solid border-black border-t border-l border-r-[3px] border-b-2 rounded-lg')} type='submit'>送出</button>
                                    </div>
                                </div>
                                {/* </div> */}
                            </div>
                        </div>

                    </form>
                </div>
                
            </div>
        </div>
    );
}

export default backendRegister;
