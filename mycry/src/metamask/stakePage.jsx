import React, { useState,useRef,useEffect,useContext } from 'react';
import classNames from 'classnames';
import { setCookie, getCookie, removeCookie } from '../components/setcookie';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {MetaMaskContext} from "./MetaMaskContext";
import { FormattedMessage } from "react-intl";

const foxStakePage = () => {
  const { 
    account,
    connected,
    getContractBalance,
    userTotalBalance,
    userNowBalance,
    web3,
    contract,
    userStaked,
    allStaking,
    stakeRate,
    contractAddress
    } = useContext(MetaMaskContext);

    //若已連接成功，且沒有餅乾則存進並初始化各種值
    useEffect(() => {
      if (account && connected && web3 && contract) {
        if (!getCookie('userAddress')) {
          setCookie('userAddress', account, 0.5);
        }
        getContractBalance();
      }
  
    }, [account, connected, web3, contract]);

    //馬上質押按下去開啟小視窗設定質押數
    const openInput = () => {
      withReactContent(Swal).fire({
        title: '請輸入您要質押的數量',
        background: '#FFF5E9',
        color: 'black',
        html: `
          <input
            type="number"
            class="swal2-input"
            id="stake-input">`,
        preConfirm: () => {
          const inputNumber = Swal.getPopup().querySelector('#stake-input');
          const inputValue = inputNumber.value;
          return inputValue;
        }
      }).then((result) => {
        if (result.value) {
          initStake(result.value);
        } else {
          withReactContent(Swal).fire({
            title: '請輸入數量',
            icon: 'warning',
            background: '#FFF5E9',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '確認',
          });
        }
      });
    };
    
    //提領質押Token
    const withdrawStake = async() => {
      withReactContent(Swal).fire({
        title: `您有${parseFloat(parseFloat(userStaked).toFixed(6))}顆$MCC質押可提領`,
        imageUrl: '/icon/mycry/mycrylogo.png',
        imageHeight: 188,
        imageWidth: 188,
        background: '#FFF5E9',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確認領取',
        cancelButtonText: '取消'
      }).then((result)=>{
        if(result.isConfirmed){
          contract.methods.withdrawStake().send({from:account})
          .on('transactionHash', (transactionHash) => {
            if(transactionHash){
              withReactContent(Swal).fire({
                title: `提領成功`,
                html: `Transaction Hash：${transactionHash}`,
                imageUrl: '/icon/mycry/mycrylogo.png',
                imageHeight: 188,
                imageWidth: 188,
                background: '#FFF5E9',
                confirmButtonColor: '#3085d6',
                confirmButtonText: '確認',
              })
            }
          })
          .on('receipt', (receipt) =>{
            if (receipt['status'] == 1) {
              try{
                getContractBalance()
              }catch(e){
                console.log(e)
              }
            }
          })
          .on('error', (error) => {
            console.error('質押提領錯誤:', error);
          });
        }
      })
    }
    
    //呼叫質押開始質押
    const setStake = (transAmount) => {
      contract.methods.setStake(transAmount).send({from:account})
      .once('transactionHash', (transactionHash) => {
        if(transactionHash){
          withReactContent(Swal).fire({
            title: `質押成功`,
            html: `Transaction Hash：${transactionHash}`,
            imageUrl: '/icon/mycry/mycrylogo.png',
            imageHeight: 188,
            imageWidth: 188,
            background: '#FFF5E9',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '確認',
          })
        }
      })
      .on('receipt', (receipt) =>{
        if (receipt['status'] == 1) {
          try{
            getContractBalance()
          }catch(e){
            console.log(e)
          }
        }
      })
      .on('error', (error) => {
        console.error('質押存入錯誤:', error);
      });
    }

    //彈窗輸入欲質押數量後的確認與檢查授權數
    const initStake = (stakeValue) => {
      if(stakeValue){
        withReactContent(Swal).fire({
          title: `您即將質押${stakeValue}顆$MCC`,
          imageUrl: '/icon/mycry/mycrylogo.png',
          imageHeight: 188,
          imageWidth: 188,
          background: '#FFF5E9',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '確認質押',
          cancelButtonText: '取消'
        }).then((result)=>{
          if (result.isConfirmed) {
            let transAmount = web3.utils.toWei(stakeValue,'ether');
            contract.methods.allowance(account,contractAddress).call()
            .then((res)=>{
              if (res < transAmount){
                contract.methods.approve(contractAddress,transAmount).send({from:account})
                .on('receipt', (receipt) => {
                  if (receipt['status'] == 1) {
                    try{
                      setStake(transAmount);
                    }catch(e){
                      console.log(e)
                    }
                  }
                })
                .on('error', (error) => {
                  console.error('質押前授權錯誤:', error);
                });
              }else{
                setStake(transAmount)
              }
            })
          }
        })
      }else{
        withReactContent(Swal).fire({
          title: `請輸入值鴨數量`,
          imageUrl: '/icon/mycry/mycrylogo.png',
          imageHeight: 188,
          imageWidth: 188,
          background: '#FFF5E9',
          confirmButtonColor: '#3085d6',
          confirmButtonText: '確認',
        })
      }
    }
    
    return (
      <div className={classNames('flex mx-auto bg-[url(/icon/mycry/mycryBG.png)] bg-[length:100%_100%] bg-center bg-no-repeat h-[94vh] justify-around')}>
        <div className={classNames('flex mx-auto container w-[1270px] h-[60%] justify-evenly flex-col')}>
          <div className={classNames('flex flex-row w-full')}>
            <div className='w-[55%] '>
              <h2 className={classNames('text-[50px] leading-[1.1] font-semibold text-orange-500')}><FormattedMessage defaultMessage="歡迎來到 MyCryCoin 質押" id="stake.welcome"></FormattedMessage></h2>
              <p className={classNames('mt-4 text-yellow-700 font-semibold')}>
                <FormattedMessage defaultMessage="MyCryCoin 準備了初始發行總量的20%作為質押回報的分發將以質押時間作為獎勵依據，最高可獲得高達40%獎勵。" 
                  id="stake.welcomeBody">
                </FormattedMessage>
              </p>
            </div>
            <div className='w-[45%] flex justify-end items-center'>
              <button onClick={openInput} className={classNames('bg-[#AD00FF] text-white w-1/3 h-10 rounded-[10px] border-t-[1px] border-r-[3px] border-b-[2px] border-l-[1px] border-black')}>
                <FormattedMessage defaultMessage="立即質押$MCC" id="stake.stakeNow"></FormattedMessage>
              </button>
            </div>
          </div>
          
          <div className='mt-6 w-full h-[35%] flex flex-row gap-16'>
            <div className={classNames('w-full flex p-[13px] flex-col justify-between items-start color-[#f9f5ef] rounded-[10px] border-black bg-[#FFF5E9] m-0')}>
              <div>
                <span className='mb-1'><FormattedMessage defaultMessage="已質押中" id="stake.staked"></FormattedMessage></span>
                <h2 className='my-1 text-[#ad00ff] text-[22px] flex items-start font-[700]'>{userStaked && parseFloat((userStaked).toFixed(4))}<span className='text-[12px] ml-2'>$MCC</span></h2>
              </div>
              <div>
                <span className='mb-1'><FormattedMessage defaultMessage="可質押" id="stake.balance"></FormattedMessage></span>
                <h2 className='my-1 text-[#ad00ff] text-[22px] flex items-start font-[700]'>{userNowBalance ? userNowBalance : 0}<span className='text-[12px] ml-2'>$MCC</span></h2>
              </div>
            </div>
            <div className={classNames('w-full flex p-[13px] flex-col justify-between items-start color-[#f9f5ef] rounded-[10px] border-black bg-[#FFF5E9] m-0')}>
              <div>
                <span className='mb-1'><FormattedMessage defaultMessage="佔質押池百分比" id="stake.staked.percent"></FormattedMessage></span>
                <h2 className='my-1 text-[#ad00ff] text-[22px] flex items-start font-[700]'>{userStaked && allStaking ? parseFloat(((userStaked) / allStaking * 100).toFixed(2)) : 0}%<span className='text-[12px] ml-2'>$MCC</span></h2>
              </div>
              <div>
                <span className='mb-1'><FormattedMessage defaultMessage="總質押數" id="stake.totalStaked"></FormattedMessage></span>
                <h2 className='my-1 text-[#ad00ff] text-[22px] flex items-start font-[700]'>{allStaking && allStaking}<span className='text-[12px] ml-2'>$MCC</span></h2>
              </div>
              <button onClick={withdrawStake} className='bg-[#AD00FF] rounded-[8px] text-[#fff] font-[400] text-[14px] min-w-[120px] min-h-[45px] py-[9px] px-1 border-t-[1px] border-r-[3px] border-b-[2px] border-l-[1px] border-black'>
                <FormattedMessage defaultMessage="提取質押中代幣" id="stake.withdrawStaked"></FormattedMessage>
              </button>
            </div>
            <div className={classNames('w-full flex p-[13px] flex-col justify-between items-start color-[#f9f5ef] rounded-[10px] border-black bg-[#FFF5E9] m-0')}>
              <div>
                <span className='mb-1'><FormattedMessage defaultMessage="預計回報率" id="stake.rateRewards"></FormattedMessage></span>
                <h2 className='my-1 text-[#ad00ff] text-[22px] flex items-start font-[700]'>{userStaked && stakeRate && parseFloat(((stakeRate / userStaked) * 100).toFixed(4))}%<span className='text-[12px] ml-2'>$MCC</span></h2>
              </div>
              <div className='flex flex-col'>
                <span className='text-[12px]'><img className='h-auto w-auto inline-block' src='/icon/ani-arrow.svg'></img><FormattedMessage defaultMessage="１年內 ２ * 天數 / １８２５%" id="stake.oneYear"></FormattedMessage></span>
                <span className='text-[12px]'><img className='h-auto w-auto inline-block' src='/icon/ani-arrow.svg'></img><FormattedMessage defaultMessage="１～３年１０％" id="stake.threeYear"></FormattedMessage></span>
                <span className='text-[12px]'><img className='h-auto w-auto inline-block' src='/icon/ani-arrow.svg'></img><FormattedMessage defaultMessage="３～４年２５％" id="stake.fourYear"></FormattedMessage></span>
                <span className='text-[12px]'><img className='h-auto w-auto inline-block' src='/icon/ani-arrow.svg'></img><FormattedMessage defaultMessage="５年以後４０％" id="stake.fiveYear"></FormattedMessage></span>
              </div>
            </div>
            <div className={classNames('w-full flex p-[13px] flex-col justify-between items-start color-[#f9f5ef] rounded-[10px] border-black bg-[#FFF5E9] m-0')}>
              <div>
                <span className='mb-1'><FormattedMessage defaultMessage="總獎勵" id="stake.totalRewards"></FormattedMessage></span>
                <h2 className='my-1 text-[#ad00ff] text-[22px] flex items-start font-[700]'>{stakeRate}<span className='text-[12px] ml-2'>$MCC</span></h2>
              </div>
            </div>
          </div>
        </div>
        <img src="/icon/mycry/fox.gif" className="absolute bottom-[7rem] right-[8rem] transform scale-x-[-1]" /> 
      </div>
    );
}
export default foxStakePage;