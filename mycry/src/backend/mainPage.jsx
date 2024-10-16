import React, { useState,useRef,useEffect,useContext } from 'react';
import classNames from 'classnames';
import styles from  "../style/mcc_fox_main.module.css";
import { useNavigate } from 'react-router-dom'
import route from '../router/router'
import { FormattedMessage } from "react-intl";
import { APIContext } from './APIContext';
import AuthContext from '../components/auth/authContext'

const MainPage = () => {
    const { 
      userAddress,
      getInitUserDatas,
      userETHBalance,
      userUSDTBalance,
      userTotalBalance,
      userNowBalance,
      currentUSDTPrice,
      buyTokenWithETH,
      buyTokenWithUSDT,
      maxInput,
      calcDoge,
      errorLog,
      nowToken,
      setNowToken
      } = useContext(APIContext);
    // console.log("BDS")
    const { user} = useContext(AuthContext);
    const [inputImg,setInputImg] = useState('ETH');

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    
    const navigate = useNavigate();

    var targetTimestamp = 1730358000;
    var interval;
    
    //2次
    useEffect(()=>{

      const updateTimer = () => {
        const nowInSeconds = Math.floor(new Date().getTime() / 1000); // 將現在的時間轉換為秒
        const distance = targetTimestamp - nowInSeconds; // 使用以秒為單位的 distance
        if (distance < 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          clearInterval(interval);
        } else {
          const days = Math.floor(distance / (60 * 60 * 24));
          const hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
          const minutes = Math.floor((distance % (60 * 60)) / 60);
          const seconds = Math.floor(distance % 60);
          setTimeLeft({ days, hours, minutes, seconds });
        }
      };
      updateTimer(); 
      interval = setInterval(updateTimer, 1000); 
      return () => clearInterval(interval); 
    }, []);

    useEffect(()=>{
      if(user){
        // console.log("HELLO")
        getInitUserDatas()
      }
    },[user])
    useEffect(()=>{
      const changeInput = () => {
        if (maxInput.current && calcDoge.current) {
            const event = { target: { value: maxInput.current.value } }; // 使用現有的值
            // maxInput.current.dispatchEvent(event);
            calcBuyDogeAmount(event); 
        }
      };
      changeInput()
    },[nowToken])

    

    //設置最大input
    const setMaxInput = () =>{
      if(maxInput.current){
        maxInput.current.value = nowToken == 'ETH' ? userETHBalance : userUSDTBalance;
        const event = { target: maxInput.current };
        calcBuyDogeAmount(event);
      }
    }

    //設置購買doge數量
    const calcBuyDogeAmount = (e) => {
      if(calcDoge.current){
        if(nowToken === 'ETH'){
          calcDoge.current.value = e.target.value * 10;
        }else if(nowToken === 'USDT'){
          calcDoge.current.value = e.target.value / currentUSDTPrice;
        }
        
      }
    }

    // //設置購買ETH數量
    const calcBuyETHAmount = (e) => {
      if(maxInput.current){
        if(nowToken === 'ETH'){
          maxInput.current.value = e.target.value / 10;
        }else if(nowToken === 'USDT'){
          maxInput.current.value = e.target.value * currentUSDTPrice;
        }
      }
    }

    // //修改圖
    const setImg = (newImg) => {
      setInputImg(newImg);
    }

    
    
    return (

      <div className={classNames('flex mx-auto h-[94vh] bg-[url(/icon/mycry/mycryBG_noc.png)] bg-[length:100%_100%] bg-center bg-no-repeat justify-around relative')}>
        <div className='container w-[1270px]' >
          <div className={classNames('flex mx-auto w-full h-[94vh]  justify-between')}>
            <div className={classNames(' w-8/12 h-3/6 flex mt-10 flex-col ')}>
              <div className={classNames(styles.main_left_block_bg,'w-11/12 h-full border-4 border-black flex items-center flex-col')}>
                <p className={classNames(styles.main_left_block_fir,'h-10 w-full text-white flex justify-center items-center')}>MyCry.exe</p>
                <p className={classNames(styles.main_left_block_sec,'h-10 w-full text-block font-semibold flex justify-center items-center')}>Welcome to</p>
                <div className={classNames(' w-full text-block font-medium flex items-center flex-col overflow-y-scroll ')}>
                  <div className={classNames(' w-10/12 text-block font-medium flex justify-center items-center flex-col')}>
                    <img src="/icon/mycry/mycrylogo.png" className={classNames(styles.main_left_block_img,'h-30 w-4/12')}></img>
                    
                    <h1 className={classNames(styles.main_left_block_h1,"my-4")}><FormattedMessage defaultMessage="MycryCoin - 最佳購買選擇" id="main.title"></FormattedMessage></h1>
                    <p className={classNames(styles.main_left_block_text,'text-center mb-4')}><FormattedMessage defaultMessage="MycryCoin 是一款基於手機的賺取加密貨幣的貨幣，將突破性的網路遊戲迷因轉化為現代支付貨幣。在預售中購買 $MCC 代幣，享受最強的支付體驗及質押以賺取更多加密貨幣！" id="main.body1"></FormattedMessage></p>
                    <p className={classNames(styles.main_left_block_text,'text-center mb-4')}><FormattedMessage defaultMessage="MyCryCoin 的故事" id="main.body2"></FormattedMessage></p>
                    <p className={classNames(styles.main_left_block_text,'text-center mb-4')}><FormattedMessage defaultMessage="在2009年，我的小世界的眾多玩家被一個神秘NPC所震撼：一位原型是豬的物件陰錯陽差變成了所有玩家的夢魘。恐慌在社區中蔓延，直到有一天，一位實力堅強的玩家在一個老舊、廢棄的代碼裡發現了一行神秘計畫，這個計畫名為“MyCry”，閃爍著神秘的魅力。" id="main.body3"></FormattedMessage></p>
                    <p className={classNames(styles.main_left_block_text,'text-center mb-4')}><FormattedMessage defaultMessage="購買MyCryCoin" id="main.body4"></FormattedMessage></p>
                    <p className={classNames(styles.main_left_block_text,'text-center mb-4')}><FormattedMessage defaultMessage="通過購買MyCryCoin與你的眾多夥伴一起在我的小世界感受膽戰心驚的爆炸。購買$MCC代幣邊玩邊賺回報！" id="main.body5"></FormattedMessage></p>
                  </div>
                </div>
              </div>
            </div>
            <div className={classNames('bg-[#FFF5E9] h-[70%] flex items-center w-4/12 mt-10 flex-col')}>
              <div className={classNames('w-full h-full border-2 border-black flex items-center flex-col')}>
                <div className={classNames(styles.main_right_block_fir,'w-full p-1.5')}>
                  <img src="/icon/widget-title.svg" className={classNames('h-30 w-full')}></img>
                  <p className={classNames(styles.main_right_block_sec)}><FormattedMessage defaultMessage="在 DEX 啟動前購買並質押" id="main.right.title"></FormattedMessage></p>
                </div>
                <div className={classNames('flex w-full justify-around p-4 text-center')}>
                  <div className={classNames(styles.main_right_block_sec_box,'bg-[#e4adff] font-medium border-black border-solid')}>
                    <div>{String(timeLeft.days).padStart(2, '0')}</div>
                    <div className={'text-[14px]'}><FormattedMessage defaultMessage="天" id="main.right.days"></FormattedMessage></div>
                  </div>
                  <div className={classNames(styles.main_right_block_sec_box,'bg-[#92d8ff] font-medium border-black border-solid ')}>
                    <div>{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className={'text-[14px]'}><FormattedMessage defaultMessage="小時" id="main.right.hours"></FormattedMessage></div>
                  </div>
                  <div className={classNames(styles.main_right_block_sec_box,'bg-[#8fffe4] font-medium border-black border-solid ')}>
                    <div>{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className={'text-[14px]'}><FormattedMessage defaultMessage="分" id="main.right.minutes"></FormattedMessage></div>
                  </div>
                  <div className={classNames(styles.main_right_block_sec_box,'bg-[#ffed8e] font-medium border-black border-solid	')}>
                    <div>{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className={'text-[14px]'}><FormattedMessage defaultMessage="秒" id="main.right.seconds"></FormattedMessage></div>
                  </div>
                </div>
                <div className={classNames('pb-1 text-[14px]')}>
                  <span><FormattedMessage defaultMessage="你已購買的$MCC" id="main.right.bought"></FormattedMessage></span>
                  <span> = {userTotalBalance}</span>
                </div>
                <div className={classNames('pb-1 text-base text-[13px]')}>
                  <span><FormattedMessage defaultMessage="你可質押的的$MCC" id="main.right.canStake"></FormattedMessage></span>
                  <span> = {userNowBalance}</span>
                </div>

                <div className={classNames(' w-full flex flex-col items-center h-full')}>
                  <div className={classNames('w-10/12 flex flex-col items-center')}>
                    <div className={classNames(styles.main_right_block_below_fir,'text-[14px] w-full h-10 flex flex-col justify-center items-center')}>
                      <p className=''>1 MCC = 0.1 ETH = {parseFloat(parseFloat(currentUSDTPrice).toFixed(4))} USDT</p>
                    </div>
                  </div>
                  <div className={classNames(' w-full flex justify-center justify-around mt-2')}>
                    <div className={classNames('w-full flex justify-around')}>
                      <button  onClick={()=>{setImg('ETH');setNowToken('ETH');}} className={classNames(styles.main_right_block_token,{ [styles.selected]: nowToken === 'ETH' })}><img className='inline-block w-auto h-full' src='/icon/mycry/ETH.png'></img><span className='pl-1'>ETH</span></button>
                      <button onClick={()=>{setImg('USDT');setNowToken('USDT');}} className={classNames(styles.main_right_block_token,{ [styles.selected]: nowToken === 'USDT' })}><img className='inline-block w-auto h-full' src='/icon/mycry/USDT.png'></img><span className='pl-1'>USDT</span></button>
                    </div>
                  </div>
                  {userAddress && (
                    <div className={classNames('w-10/12 flex flex-col items-center mt-2')}>
                      <div className={classNames(styles.main_right_block_below_fir,'w-full h-10 flex justify-center items-center')}>
                        <p className=''>{nowToken} Balance {nowToken == 'ETH' ? userETHBalance : userUSDTBalance}</p>
                      </div>
                    </div>
                  )}
                  

                  <div className={classNames('w-full flex justify-around mt-2')}>
                    <div className={classNames('w-full flex justify-around')}>
                      <div className={classNames('w-[150px] text-[12px] flex justify-between items-center')}>
                        <p><FormattedMessage defaultMessage="你支付的" id="main.right.pay"></FormattedMessage> {nowToken}</p>
                        <button onClick={()=>setMaxInput()}><FormattedMessage defaultMessage="最大" id="main.right.max"></FormattedMessage></button>
                      </div>
                      <div className={classNames('w-[150px] text-[12px] flex justify-between')}>
                        <p><FormattedMessage defaultMessage="你預計收到的$MCC" id="main.right.receive"></FormattedMessage></p>
                      </div>
                    </div>
                  </div>
                  <div className={classNames('w-full flex justify-around')}>
                    <div className={classNames('w-full flex justify-around')}>
                      <div className={classNames('relative')}>
                        <input type='number' placeholder='0' ref={maxInput} onChange={calcBuyDogeAmount} className={classNames(styles.main_right_block_input,'flex text-black bg-white border-black border-solid py-2 px-3 font-normal pr-[55px]')}></input>
                        <img src={`/icon/mycry/${inputImg}.png`} className={classNames(styles.main_right_block_input_logo,'absolute top-1/2 left-1/2 h-auto w-[23%]')}></img>
                      </div>
                      <div className={classNames('relative')}>
                        <input type='number' placeholder='0' ref={calcDoge} onChange={calcBuyETHAmount} className={classNames(styles.main_right_block_input,'flex text-black bg-white border-black border-solid py-2 px-3 font-normal pr-[55px]')}></input>
                        <img src='/icon/mycry/cryHead.png' className={classNames(styles.main_right_block_input_logo,'absolute top-1/2 left-1/2 h-auto w-[23%]')}></img>
                      </div>
                    </div>
                  </div>
                  <div className='w-full break-words'>
                    {userAddress && errorLog && (
                      <p className="mt-2 text-center text-[14px] text-red-500 font-medium">
                        <FormattedMessage 
                          defaultMessage="" 
                          id={errorLog} 
                        />
                      </p>
                    ) 
                    }
                  </div>
                  <div className={classNames('w-full flex justify-center items-center flex-col h-full')}>
                    {userAddress && (
                      <>
                        <div className={classNames('w-full flex justify-around items-center mt-2')}>
                          <button onClick={nowToken == 'ETH' ? buyTokenWithETH : buyTokenWithUSDT} className={classNames('bg-[#ad00ff] w-4/12 text-white border-solid border-black border-t border-l border-r-[3px] border-b-2 rounded-lg h-12')}>
                            <FormattedMessage defaultMessage="購買代幣" id="main.right.buy"></FormattedMessage>
                          </button>
                          {userNowBalance == 0 ?(
                            <div className={classNames('bg-[#AD00FF66] w-4/12 text-white border-solid border-black border-t border-l border-r-[3px] border-b-2 rounded-lg h-12 flex items-center justify-center')}>
                              <FormattedMessage defaultMessage="質押" id="main.right.stake"></FormattedMessage>
                            </div>
                          ):
                            <button onClick={() => navigate(route.MCC_BACK_STAKE)} className={classNames('bg-[#ad00ff] w-4/12 text-white border-solid border-black border-t border-l border-r-[3px] border-b-2 rounded-lg h-12')}>
                              <FormattedMessage defaultMessage="質押" id="main.right.stake"></FormattedMessage>
                            </button>
                          }
                          
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img src="/icon/mycry/chicken.gif" className="absolute bottom-[10rem] left-[24rem]" /> 
      </div>
    );
}
export default MainPage;