import React, { useContext, useRef, useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import ROUTES from '../router/router';
import classNames from 'classnames';
import {APIContext} from "../backend/APIContext";
import AuthContext from './auth/authContext';
import { useIntl } from 'react-intl';
import { FormattedMessage } from "react-intl";

const BackHeader = ({ showHeader,setHeaderHeight ,setLocale}) => {
    if (!showHeader) return null;
    const { 
        userAddress
        } = useContext(APIContext);
    const { user, handleLogout } = useContext(AuthContext);
    const [hideAddress,setHideAddress] = useState('0');
    const [lang, setLang] = useState('zh-TW')
    const headerRef = useRef(null);
    const inputRef = useRef(null);
    const intl = useIntl();

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.clientHeight); // 將高度通過 props 傳遞給父組件
        }
    }, [setHeaderHeight]);
    
    useEffect(() => {
        changeLang()
      },[lang])

      const changeLang = async() => {
        const resp = await fetch(`/lang/${lang}.json`)
        const data = await resp.json()
        setLocale(data)
    }

    useEffect(()=>{
        const makeAddress = () => {
            let frontPart = userAddress.slice(0, 6);
            let endPart = userAddress.slice(-4);
            let result = `${frontPart}...${endPart}`;
            setHideAddress(result);
        }
        userAddress && makeAddress()
    },[userAddress])

    //只有有SSL時或本地才可複製成功
    const copyToClipboard = () => {
        navigator.clipboard.writeText(userAddress)
            .then(() => {
                const copied = intl.formatMessage({
                    id: 'header.copied',
                    defaultMessage: '已複製!'
                  });

                inputRef.current.setCustomValidity(copied);
                inputRef.current.reportValidity();
                
                setTimeout(() => {
                    inputRef.current.setCustomValidity("");
                }, 2000);
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <div ref={headerRef} className={classNames('bg-[#FFEE52] mx-auto')}>
            <div className='container w-[1270px] mx-auto flex justify-between p-2 '>
                <div className="flex items-center w-[40%] gap-2">
                    <Link to={ROUTES.MCC_BACK_MAIN} className="flex items-center w-full">
                        <img className='w-full h-[39px]' src='/icon/mycry/mycryCrypto.png' ></img></Link>
                    <Link to={ROUTES.MCC_BACK_STAKE} className="flex w-1/2 text-center h-full">
                            <p className='flex items-center justify-center border-t border-l border-r-[3px] border-b-2 rounded-lg bg-[#ad00ff] text-white border-solid border-black font-black text-center outline-none w-full'><FormattedMessage defaultMessage="質押" id="header_stake"></FormattedMessage></p></Link>
                    <Link to={ROUTES.MCC_FOX_MAIN} className="flex w-1/2 text-center h-full">
                        <p className='flex items-center justify-center border-t border-l border-r-[3px] border-b-2 rounded-lg bg-[#ad00ff] text-white border-solid border-black font-black text-center outline-none w-full'><FormattedMessage defaultMessage="小狐狸模式" id="header_fox_mode"></FormattedMessage></p></Link>
                    <Link to={ROUTES.MCC_COPYRIGHT} className="flex w-1/2 text-center h-full">
                        <p className='flex items-center justify-center border-t border-l border-r-[3px] border-b-2 rounded-lg bg-[#ad00ff] text-white border-solid border-black font-black text-center outline-none w-full'><FormattedMessage defaultMessage="版權聲明" id="header_copyright"></FormattedMessage></p></Link>
                </div>
                <div className="flex items-center gap-2 w-[25%]">
                    <button onClick={copyToClipboard} title={intl.formatMessage({ id: 'button.title.copy', defaultMessage: '點擊以複製地址' })} className='p-1 border-t border-l border-r-[3px] border-b-2 rounded-lg bg-[#ad00ff] text-white border-solid border-black h-full'>{hideAddress}</button>
                    <input 
                        ref={inputRef} 
                        type="text" 
                        style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }} 
                    />
                    <select className='p-1 border-t border-l border-r-[3px] border-b-2 rounded-lg bg-[#ad00ff] text-white border-solid border-black font-black text-center outline-none h-full' value={lang} onChange={(e) => {setLang(e.target.value)}}>
                        <option value="en">English</option>
                        <option value="zh-TW">繁體中文</option>
                        <option value="jp">日本語</option>
                    </select>
                    {user && <Link onClick={handleLogout} className='flex w-1/2 text-center h-full'><p className='flex items-center justify-center border-t border-l border-r-[3px] border-b-2 rounded-lg bg-[#ad00ff] text-white border-solid border-black font-black text-center outline-none w-full h-full'><FormattedMessage defaultMessage="登出" id="header_logout"></FormattedMessage></p></Link>}
                </div>
            </div>
        </div>

    );
};
export default BackHeader;
