import React, { useState,useRef,useEffect,useContext } from 'react';
import classNames from 'classnames';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FormattedMessage } from "react-intl";
import { APIContext } from './APIContext';
import AuthContext from '../components/auth/authContext'

const backStakePage = () => {
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
      setNowToken,
      allStaking,
      stakeRate,
      userStaked,
      openInput,
      withdrawStake,
      poolPersent,
      rateRewards,
      totalRewards
      } = useContext(APIContext);
      const { user} = useContext(AuthContext);
      
      useEffect(()=>{
        if(user){
          getInitUserDatas()
        }
      },[user])
    
    return (
      <div className={classNames('flex mx-auto bg-[url(/icon/mycry/mycryBG.png)] bg-[length:100%_100%] bg-center bg-no-repeat h-[94vh] justify-around')}>
        <div className={classNames('flex mx-auto container w-[1270px] h-[60%] justify-evenly flex-col')}>
          <div className={classNames('flex flex-row w-full')}>
            <div className='w-[55%] '>
              <h2 className={classNames('text-[50px] leading-[1.1] font-semibold text-orange-500')}><FormattedMessage defaultMessage="歡迎來到 PlayDoge 質押" id="stake.welcome"></FormattedMessage></h2>
              <p className={classNames('mt-4 text-yellow-700 font-semibold')}>
                <FormattedMessage defaultMessage="PlayDoge 代幣回報的分發將以每個以太坊 (ETH) 區塊 17.88 個 $PLAY 的速度進行，並在 3 年內發放完畢。" 
                  id="stake.welcomeBody">
                </FormattedMessage>
              </p>
            </div>
            <div className='w-[45%] flex justify-end items-center'>
              <button onClick={openInput} className={classNames('bg-[#AD00FF] text-white w-1/3 h-10 rounded-[10px] border-t-[1px] border-r-[3px] border-b-[2px] border-l-[1px] border-black')}>
                <FormattedMessage defaultMessage="立即質押$PLAY" id="stake.stakeNow"></FormattedMessage>
              </button>
            </div>
          </div>
          
          <div className='mt-6 w-full h-[35%] flex flex-row gap-16'>
            <div className={classNames('w-full flex p-[13px] flex-col justify-between items-start color-[#f9f5ef] rounded-[10px] border-black bg-[#FFF5E9] m-0')}>
              <div>
                <span className='mb-1'><FormattedMessage defaultMessage="已質押中" id="stake.staked"></FormattedMessage></span>
                <h2 className='my-1 text-[#ad00ff] text-[22px] flex items-start font-[700]'>{Number((userStaked).toFixed(4)) || 0}<span className='text-[12px] ml-2'>$PLAY</span></h2>
              </div>
              <div>
                <span className='mb-1'><FormattedMessage defaultMessage="可質押" id="stake.balance"></FormattedMessage></span>
                <h2 className='my-1 text-[#ad00ff] text-[22px] flex items-start font-[700]'>{userNowBalance || 0}<span className='text-[12px] ml-2'>$PLAY</span></h2>
              </div>
            </div>
            <div className={classNames('w-full flex p-[13px] flex-col justify-between items-start color-[#f9f5ef] rounded-[10px] border-black bg-[#FFF5E9] m-0')}>
              <div>
                <span className='mb-1'><FormattedMessage defaultMessage="佔質押池百分比" id="stake.staked.percent"></FormattedMessage></span>
                <h2 className='my-1 text-[#ad00ff] text-[22px] flex items-start font-[700]'>{poolPersent}%<span className='text-[12px] ml-2'>$PLAY</span></h2>
              </div>
              <div>
                <span className='mb-1'><FormattedMessage defaultMessage="總質押數" id="stake.totalStaked"></FormattedMessage></span>
                <h2 className='my-1 text-[#ad00ff] text-[22px] flex items-start font-[700]'>{allStaking}<span className='text-[12px] ml-2'>$PLAY</span></h2>
              </div>
              <button onClick={withdrawStake}  className='bg-[#AD00FF] rounded-[8px] text-[#fff] font-[400] text-[14px] min-w-[120px] min-h-[45px] py-[9px] px-1 border-t-[1px] border-r-[3px] border-b-[2px] border-l-[1px] border-black'>
                <FormattedMessage defaultMessage="提取質押中代幣" id="stake.withdrawStaked"></FormattedMessage>
              </button>
            </div>
            <div className={classNames('w-full flex p-[13px] flex-col justify-between items-start color-[#f9f5ef] rounded-[10px] border-black bg-[#FFF5E9] m-0')}>
              <div>
                <span className='mb-1'><FormattedMessage defaultMessage="預計回報率" id="stake.rateRewards"></FormattedMessage></span>
                <h2 className='my-1 text-[#ad00ff] text-[22px] flex items-start font-[700]'>{rateRewards}%<span className='text-[12px] ml-2'>$PLAY</span></h2>
              </div>
              <div className='flex flex-col'>
                <span className='text-[12px]'><img className='h-auto w-auto inline-block' src='/icon/ani-arrow.svg'></img><FormattedMessage defaultMessage="１年內 ２ * 天數 / １８２５%" id="stake.oneYear"></FormattedMessage></span>
                <span className='text-[12px]'><img className='h-auto w-auto inline-block' src='/icon/ani-arrow.svg'></img><FormattedMessage defaultMessage="１～３年１０％" id="stake.threeYear"></FormattedMessage></span>
                <span className='text-[12px]'><img className='h-auto w-auto inline-block' src='/icon/ani-arrow.svg'></img><FormattedMessage defaultMessage="３～４年２５％" id="stake.fourYear"></FormattedMessage></span>
                <span className='text-[12px]'><img className='h-auto w-auto inline-block' src='/icon/ani-arrow.svg'></img><FormattedMessage defaultMessage="５年以後４０％" id="stake.fiveYear"></FormattedMessage></span>
              </div>
            </div>
            {/* <div className={classNames('w-full flex p-[13px] flex-col justify-between items-start color-[#f9f5ef] rounded-[10px] border-black bg-[#FFF5E9] m-0')}>
              <div>
                <span className='mb-1'>當前獎勵</span>
                <h2 className='my-1 text-[#ad00ff] text-[22px] flex items-start font-[700]'>0<span className='text-[12px] ml-2'>Per ETH Block</span></h2>
              </div>
            </div> */}
            <div className={classNames('w-full flex p-[13px] flex-col justify-between items-start color-[#f9f5ef] rounded-[10px] border-black bg-[#FFF5E9] m-0')}>
              <div>
                <span className='mb-1'><FormattedMessage defaultMessage="總獎勵" id="stake.totalRewards"></FormattedMessage></span>
                <h2 className='my-1 text-[#ad00ff] text-[22px] flex items-start font-[700]'>{totalRewards}<span className='text-[12px] ml-2'>$PLAY</span></h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
export default backStakePage;