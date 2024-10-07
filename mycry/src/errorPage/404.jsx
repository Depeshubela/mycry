import { render } from "@testing-library/react";
import React from "react";


const Page404 = () => {
    return(
        <div className={'w-full h-screen flex flex-col text-[#ad00ff] bg-[url(/icon//mycry/mycryBG.png)] bg-[length:100%_100%] bg-center bg-no-repeat'}>
            <div className="flex flex-col text-[40px] text-center">
                <div className="">
                    <p>404 Page Not Found!</p>
                    <p>立刻加入MyCry</p>
                </div>
                <div className="flex flex-row justify-center gap-12 ">
                    <a href={window.location.origin + '/mcc/backend/login'}><p className="text-[#0000EE]">會員模式</p></a>   
                    <a href={window.location.origin + '/mcc/metamask/main'}><p className="text-[#0000EE]">小狐狸模式</p></a>
                    
                </div> 
            </div>
            <div className="flex h-full w-full">
                <div className="h-full w-full flex items-center pt-[7.5rem] pl-[24rem]">
                    <img src="/icon/mycry/chicken.gif"  className="" />
                </div>
            </div>
        </div>
        
    )
}
export default Page404;