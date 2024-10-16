import React, { useContext, useRef, useEffect,useState } from 'react';
import { Link,useLocation } from 'react-router-dom';
import ROUTES from '../router/router';
import classNames from 'classnames';
import { FormattedMessage } from "react-intl";

const copyrightHeader = ({ showHeader,setHeaderHeight ,setLocale}) => {
    if (!showHeader) return null;

    const [lang, setLang] = useState('zh-TW')
    const headerRef = useRef(null);
    const location = useLocation();
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

    return (
        <div ref={headerRef} className={classNames('bg-[#FFEE52] mx-auto')}>
            <div className='container w-[1270px] mx-auto flex justify-between p-2'>
                <div className="flex items-center w-[30%] gap-2">
                    <div to={ROUTES.MCC_FOX_MAIN} className="flex items-center w-full">
                        <img className='w-full h-[39px]' src='/icon/mycry/mycryCrypto.png' ></img></div>
                    <Link to={ROUTES.MCC_FOX_MAIN} className="flex w-1/2 text-center h-full whitespace-nowrap">
                            <p className='flex items-center justify-center border-t border-l border-r-[3px] border-b-2 rounded-lg bg-[#ad00ff] text-white border-solid border-black font-black text-center outline-none w-full'><FormattedMessage defaultMessage="小狐狸模式" id="header_fox_mode"></FormattedMessage></p></Link>
                    <Link to={ROUTES.MCC_BACK_MAIN} className="flex w-1/2 text-center h-full whitespace-nowrap">
                        <p className='flex items-center justify-center border-t border-l border-r-[3px] border-b-2 rounded-lg bg-[#ad00ff] text-white border-solid border-black font-black text-center outline-none w-full'><FormattedMessage defaultMessage="會員模式" id="header_member_mode"></FormattedMessage></p></Link>
                </div>
                <div className="flex items-center gap-2">
                    <select className='p-1 border-t border-l border-r-[3px] border-b-2 rounded-lg bg-[#ad00ff] text-white border-solid border-black font-black text-center outline-none h-full' value={lang} onChange={(e) => {setLang(e.target.value)}}>
                        <option value="en">English</option>
                        <option value="zh-TW">繁體中文</option>
                        <option value="jp">日本語</option>
                    </select>
                </div>
            </div>
        </div>

    );
};
export default copyrightHeader;
