import React, { useState,useRef,useEffect,useContext } from 'react';
import classNames from 'classnames';
import styles from  "../style/mcc_fox_main.module.css";
import { useNavigate } from 'react-router-dom'
import route from '../router/router'
import {MetaMaskContext} from "./MetaMaskContext";
import { FormattedMessage } from "react-intl";

// import USDT_ABI from '../SPA_USDT_ABI.json'
const foxMainPage = () => {
    const { 
      connect,
      disconnect,
      account,
      userUSDTBalance,
      userETHBalance,
      getContractBalance,
      userTotalBalance,
      userNowBalance,
      errorLog,
      web3,
      contract,
      USDTcontract,
      usdtcontractAddress,
      contractAddress
      } = useContext(MetaMaskContext);

      console.log("fmain")
    const [inputImg,setInputImg] = useState('ETH');
    const [nowToken, setNowToken] = useState('ETH');
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [buyTokenTx, setBuyTokenTx] = useState(null);
    const [currentUSDTPrice, setCurrentUSDTPrice] = useState(null);
    const maxInput = useRef(null);
    const calcDoge = useRef(null);
    const navigate = useNavigate();
    // const contractABI = MCC_ABI;
    // const contractAddress = "0x43eD634B7E742906b2d8CaE20071c7ebBfe2cdBa";
    // const usdtcontractABI = USDT_ABI;
    // const usdtcontractAddress = "0x0f5d5521e0dFA45778973a077433F1331c0F9390";
    var targetTimestamp = 1726715681;
    var interval;

    useEffect(()=>{
      
      //倒數計時
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
    }, [account]);
    useEffect(() => {
      updateUSDTPrice()
      const intervalId = setInterval(() => {
        updateUSDTPrice()
        // console.log('執行')
      }, 30000); // 1000ms = 1 秒
  
      // 清除定時器避免記憶體洩漏
      return () => clearInterval(intervalId);

    }, [currentUSDTPrice]);


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

    //設置購買ETH數量
    const calcBuyETHAmount = (e) => {
      if(maxInput.current){
        if(nowToken === 'ETH'){
          maxInput.current.value = e.target.value / 10;
        }else if(nowToken === 'USDT'){
          maxInput.current.value = e.target.value * currentUSDTPrice;
        }
      }
    }


    //修改圖
    const setImg = (newImg) => {
      setInputImg(newImg);
    }

    const buyTokenWithETH = () => {
      contract.methods.buyWithEth()
        .send({ from: account, value: web3.utils.toWei(maxInput.current.value, 'ether') })
        .on('transactionHash', (transactionHash) => {
          setBuyTokenTx(transactionHash);
          maxInput.current.value = ''
          calcDoge.current.value = ''
        })
        .on('receipt', (receipt) => {
          if (receipt['status'] == 1) {
            try{
              getContractBalance();
            }catch(e){
              console.log(e)
            }
          }
        })
        .on('error', (error) => {
          console.error('Transaction failed:', error);
        });
    };

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

    const checkUSDTAllowance = () => {

      let transAmount = web3.utils.toWei(maxInput.current.value, 'Mwei');
      USDTcontract.methods.allowance(account,contractAddress).call()
      .then((res)=>{
        if (res < transAmount){
          // console.log(transAmount , Number(res))
          USDTcontract.methods.approve(contractAddress,transAmount).send({from:account})
          .on('receipt', (receipt) => {
            if (receipt['status'] == 1) {
              try{
                buyTokenWithUSDT(transAmount);
              }catch(e){
                console.log(e)
              }
            }
          })
          .on('error', (error) => {
            console.error('USDT購買授權錯誤:', error);
          });
        }else{
          buyTokenWithUSDT(transAmount)
        }
      })
    };

    const buyTokenWithUSDT = (transAmount) => {
      contract.methods.buyWithUSDT(transAmount)
      .send({ from: account,value:0 })
      .on('transactionHash', (transactionHash) => {
        setBuyTokenTx(transactionHash);
        maxInput.current.value = ''
        calcDoge.current.value = ''
      })
      .on('receipt', (receipt) => {
        if (receipt['status'] == 1) {
          try{
            getContractBalance();
          }catch(e){
            console.log(e)
          }
        }
      })
      .on('error', (error) => {
        console.error('Transaction failed:', error);
      });
    }
    
    const updateUSDTPrice =() => {

      let apiEndpoint = 'https://api.binance.us/api/v3/ticker/price?symbol=USDTUSD';
      fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
          // let price = parseFloat(data.price).toFixed(4);
          // console.log(price);
          setCurrentUSDTPrice(parseFloat(data.price).toFixed(4))
      });
    }
    
    
    return (

      <div className={classNames('flex mx-auto h-[94vh] bg-[url(/icon/mycry/mycryBG_noc.png)] bg-[length:100%_100%] bg-center bg-no-repeat justify-around')}>
        <div className='container w-[1270px]'>
          <div className={classNames('flex mx-auto w-full h-[94vh]  justify-between')}>
            <div className={classNames(' w-8/12 h-3/6 flex mt-10 flex-col ')}>
              <div className={classNames(styles.main_left_block_bg,'w-11/12 h-full border-4 border-black flex items-center flex-col')}>
                <p className={classNames(styles.main_left_block_fir,'h-10 w-full text-white flex justify-center items-center')}>PlayDoge.exe</p>
                <p className={classNames(styles.main_left_block_sec,'h-10 w-full text-block font-semibold flex justify-center items-center')}>Welcome to</p>
                <div className={classNames(' w-full text-block font-medium flex items-center flex-col overflow-y-scroll ')}>
                  <div className={classNames(' w-10/12 text-block font-medium flex justify-center items-center flex-col')}>
                    <img src="/icon/mycry/mycrylogo.png" className={classNames(styles.main_left_block_img,'h-30 w-4/12')}></img>
                    
                    <h1 className={classNames(styles.main_left_block_h1,"my-4")}><FormattedMessage defaultMessage="PlayDoge - 最佳 P2E Doge 夥伴遊戲" id="main.title"></FormattedMessage></h1>
                    <p className={classNames(styles.main_left_block_text,'text-center mb-4')}><FormattedMessage defaultMessage="PlayDoge 是一款基於手機的賺取加密貨幣的遊戲，將標志性的 Doge 迷因轉化為類似電子寵物的虛擬寵物。重溫 90 年代的懷舊情懷！在預售中購買 $PLAY 代幣，享受經典的 2D 冒險並賺取更多加密貨幣！" id="main.body1"></FormattedMessage></p>
                    <p className={classNames(styles.main_left_block_text,'text-center mb-4')}><FormattedMessage defaultMessage="PlayDoge 的故事" id="main.body2"></FormattedMessage></p>
                    <p className={classNames(styles.main_left_block_text,'text-center mb-4')}><FormattedMessage defaultMessage="在2024年，加密貨幣世界被一個神秘事件震撼：所有深受喜愛的Doge——標志性的加密貨幣迷因——突然消失得無影無蹤。恐慌在Doge社區中蔓延，直到有一天，一位滿懷希望的Doge主人在一個老舊、廢棄的遊樂場里發現了一台老式街機。這個遊戲名為“PlayDoge”，閃爍著懷舊的魅力。" id="main.body3"></FormattedMessage></p>
                    <p className={classNames(styles.main_left_block_text,'text-center mb-4')}><FormattedMessage defaultMessage="PlayDoge - 最佳 P2E Doge 夥伴遊戲" id="main.body4"></FormattedMessage></p>
                    <p className={classNames(styles.main_left_block_text,'text-center mb-4')}><FormattedMessage defaultMessage="PlayDoge - 最佳 P2E Doge 夥伴遊戲" id="main.body5"></FormattedMessage></p>
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
                {/* <div className={'w-full px-6 pb-6 mt-2'}>
                    <ProgressBarComponent numerator={25} denominator={100} />
                </div>
                <div className={classNames('pb-1 text-[15px]')}>
                  <span>已籌集USDT: </span>
                  <span>$1234</span>
                  <span> / $5678</span>
                </div> */}
                <div className={classNames('pb-1 text-[14px]')}>
                  <span><FormattedMessage defaultMessage="你已購買的$PLAY" id="main.right.bought"></FormattedMessage></span>
                  <span> = {Number(userTotalBalance).toPrecision(8)}</span>
                </div>
                <div className={classNames('pb-1 text-base text-[13px]')}>
                  <span><FormattedMessage defaultMessage="你可質押的的$PLAY" id="main.right.canStake"></FormattedMessage></span>
                  <span> = {Number(userNowBalance).toPrecision(8)}</span>
                </div>

                <div className={classNames(' w-full flex flex-col items-center h-full')}>
                  <div className={classNames('w-10/12 flex flex-col items-center')}>
                    <div className={classNames(styles.main_right_block_below_fir,'text-[14px] w-full h-10 flex flex-col justify-center items-center')}>
                      <p className=''>1 PLAY = 0.1 ETH = {currentUSDTPrice} USDT</p>
                      {/* <p className=''>1 PLAY = 0.1 ETH</p> */}
                    </div>
                  </div>
                  <div className={classNames(' w-full flex justify-center justify-around mt-2')}>
                    <div className={classNames('w-full flex justify-around')}>
                      <button  onClick={()=>{setImg('ETH');setNowToken('ETH')}} className={classNames(styles.main_right_block_token,{ [styles.selected]: nowToken === 'ETH' })}><img className='inline-block w-auto h-full' src='/icon/mycry/ETH.png'></img><span className='pl-1'>ETH</span></button>
                      <button onClick={()=>{setImg('USDT');setNowToken('USDT')}} className={classNames(styles.main_right_block_token,{ [styles.selected]: nowToken === 'USDT' })}><img className='inline-block w-auto h-full' src='/icon/mycry/USDT.png'></img><span className='pl-1'>USDT</span></button>
                    </div>
                  </div>
                  {account && (
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
                        <p><FormattedMessage defaultMessage="你預計收到的$PLAY" id="main.right.receive"></FormattedMessage></p>
                      </div>
                    </div>
                  </div>
                  <div className={classNames('w-full flex justify-around')}>
                    <div className={classNames('w-full flex justify-around')}>
                      <div className={classNames('relative')}>
                        <input placeholder='0' ref={maxInput} onChange={calcBuyDogeAmount} className={classNames(styles.main_right_block_input,'flex text-black bg-white border-black border-solid py-2 px-3 font-normal pr-[55px]')}></input>
                        <img src={`/icon/mycry/${inputImg}.png`} className={classNames(styles.main_right_block_input_logo,'absolute top-1/2 left-1/2 h-auto w-[23%]')}></img>
                      </div>
                      <div className={classNames('relative')}>
                        <input placeholder='0' ref={calcDoge} onChange={calcBuyETHAmount} className={classNames(styles.main_right_block_input,'flex text-black bg-white border-black border-solid py-2 px-3 font-normal pr-[55px]')}></input>
                        <img src='/icon/mycry/cryHead.png' className={classNames(styles.main_right_block_input_logo,'absolute top-1/2 left-1/2 h-auto w-[23%]')}></img>
                      </div>
                    </div>
                  </div>
                  <div className='w-full break-words'>
                    {account && errorLog ? (
                      <p className='mt-2 text-red-500 font-medium'>{errorLog}</p>
                    ) : 
                      buyTokenTx && 
                      <p className='mt-2 font-medium'>
                        <span className='text-base'>Transaction&nbsp;Hash:</span>
                        <span className='text-sm text-blue-500 underline'><a href={`https://sepolia.arbiscan.io/tx/${buyTokenTx}`} target="_blank">{buyTokenTx}</a></span>
                      </p>
                    }
                  </div>
                  <div className={classNames('w-full flex justify-center items-center flex-col h-full')}>
                    {account ? (
                      <>
                        <div className={classNames('w-full flex justify-around items-center mt-2')}>
                          <button onClick={nowToken == 'ETH' ? buyTokenWithETH : checkUSDTAllowance} className={classNames('bg-[#ad00ff] w-4/12 text-white border-solid border-black border-t border-l border-r-[3px] border-b-2 rounded-lg h-12')}>
                            <FormattedMessage defaultMessage="購買代幣" id="main.right.buy"></FormattedMessage>
                          </button>
                          {userNowBalance == 0 ?(
                            <div className={classNames('bg-[#AD00FF66] w-4/12 text-white border-solid border-black border-t border-l border-r-[3px] border-b-2 rounded-lg h-12 flex items-center justify-center')}>
                              <FormattedMessage defaultMessage="質押" id="main.right.stake"></FormattedMessage>
                            </div>
                          ):
                            <button onClick={() => navigate(route.MCC_FOX_STAKE)} className={classNames('bg-[#ad00ff] w-4/12 text-white border-solid border-black border-t border-l border-r-[3px] border-b-2 rounded-lg h-12')}>
                              <FormattedMessage defaultMessage="質押" id="main.right.stake"></FormattedMessage>
                            </button>
                          }
                          
                        </div>
                        <div className={classNames('w-full flex justify-center items-center')}>
                          <button onClick={disconnect} className={classNames('bg-[#ad00ff] w-6/12 text-white border-solid border-black border-t border-l border-r-[3px] border-b-2 rounded-lg h-12 mt-8')}>
                            <FormattedMessage defaultMessage="斷開錢包" id="main.right.disconnect"></FormattedMessage>
                          </button>
                        </div>
                      </>
                    )
                    : <button onClick={connect} id='test' className={classNames('bg-[#ad00ff] w-6/12 text-white border-solid border-black border-t border-l border-r-[3px] border-b-2 rounded-lg min-h-[45px]')}>
                        <FormattedMessage defaultMessage="連接錢包" id="main.right.connect"></FormattedMessage>
                      </button>
                    }
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
export default foxMainPage;