import React, { createContext, useState, useEffect,useCallback } from 'react';
import { useSDK } from "@metamask/sdk-react";
import Web3 from 'web3';
import MCC_ABI from '../MCC_ABI.json';
import USDT_ABI from '../SPA_USDT_ABI.json'
import { setCookie, getCookie, removeCookie } from '../components/setcookie';

export const MetaMaskContext = createContext();
export const MyMetaMaskProvider = ({ children }) => {
  
  const { sdk,  connecting, provider, chainId } = useSDK();
  const [account, setAccount] = useState();
  const [connected, setConnected] = useState();
  const [hideAddress,setHideAddress] = useState('0');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [USDTcontract, setUSDTContract] = useState(null);
  const [userETHBalance, setUserETHBalance] = useState(0);
  const [userUSDTBalance, setUserUSDTBalance] = useState(0);
  const [userTotalBalance,setUserTotalBalance] = useState(0);
  const [userNowBalance,setUserNowBalance] = useState(0);
  const [errorLog, setErrorLog] = useState(null);
  const [allStaking,setAllStaking] = useState(0);
  const [stakeRate,setStakeRate] = useState(0);
  const [userStaked,setUserStaked] =useState(0);

  const contractABI = MCC_ABI;
  const contractAddress = "0xD83Ad6b2B3Aff6c5fCCB17fa8901E1B5401873d9";
  const usdtcontractABI = USDT_ABI;
  const usdtcontractAddress = "0x0f5d5521e0dFA45778973a077433F1331c0F9390";

  //檢查小狐狸是否已加入arbi sepolia鏈並切換過去
  useEffect(()=>{
    const switchEthereumChain = async () => {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x66eee' }],
        });
      } catch (e) {
        if (e.code == 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x66eee',
                  chainName: 'Arbitrum Sepolia',
                  nativeCurrency: {
                    name: 'Arbitrum Sepolia',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  blockExplorerUrls: ['https://sepolia.arbiscan.io'],
                  rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
                },
              ],
            });
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x66eee' }],
            });

          } catch (addError) {
            console.error('no.4902:',addError);
          }
        }
      }
    }
    switchEthereumChain()
  },[])


  useEffect(()=>{
    //如果餅乾有存地址，則直接設定地址給小狐狸
    const checkConnection = async () => {
      const accounts = getCookie('userAddress');
      if (accounts && accounts.length > 0 && !connected) {
        setAccount(accounts);
        setConnected(true)
      }
    };
    checkConnection();

    if(account){
        makeAddress()
    }
    
    if (typeof window.ethereum != 'undefined' && connected && window.ethereum.isMetaMask) {
      try {
        // 初始化Web3
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // 初始化Token合約
        const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(contractInstance);
        
        //初始化USDT合約
        const usdtcontract = new web3Instance.eth.Contract(usdtcontractABI,usdtcontractAddress);
        setUSDTContract(usdtcontract);
      } catch (error) {
        console.error("初始化Web3或合約錯誤:", error);
      }
    }
  },[account])   

  //若已連接成功，且沒有餅乾則存進並初始化各種值
  useEffect(() => {
    if (account && connected && web3 && contract && chainId) {
      if (!getCookie('userAddress')) {
        setCookie('userAddress', account, 0.5);
      }
      getContractBalance();
      getMainBalance();
    }
    if (parseFloat(userETHBalance) > 0.015) {
      setErrorLog(null);
    }
  }, [account, connected, web3, contract,chainId]);

  //小狐狸連接
  const connect = async () => {
    try {
        // console.log(connected)
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
      setConnected(true)
      
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  }

  //小狐狸斷線
  const disconnect = async () => {
    try {
      const accounts = await sdk?.terminate();
      removeCookie('userAddress')
      setAccount(accounts?.[0]);
      setConnected(false)
    } catch (err) {
      console.warn("failed to disconnect..", err);
    }
  }

  //把地址縮寫並放上header
  const makeAddress = () => {
    let frontPart = account.slice(0, 6); // 取得前四個字
    let endPart = account.slice(-4); // 取得後四個字
    let result = `${frontPart}...${endPart}`; // 拼接字串
    setHideAddress(result);
  }

  //取得arbi sepolia的ETH餘額
  const getMainBalance = async() => {
    const accounts = await ethereum.request({method:'eth_requestAccounts'})
    const ethbalance = await ethereum.request({method:'eth_getBalance',params:[account,'latest'],"id":1})
    let amount = parseFloat(web3.utils.fromWei(ethbalance,'ether')).toFixed(6)
    setUserETHBalance(amount);
    const usdtbalance = await USDTcontract.methods.balanceOf(account).call();
    setUserUSDTBalance(parseFloat(web3.utils.fromWei(usdtbalance,'picoether')).toFixed(3));
    if (parseFloat(amount) <= 0.015){
      setErrorLog('請確保您有大於0.015 ETH 以支付GAS與購買費用')
    }
  }

  //取得Token各項餘額
  const getContractBalance = async() => {
    try {
      const balanceOf = await contract.methods.balanceOf(account).call();
      const stakeData = await contract.methods.stakeDataView(account).call();
      const allStaked = await contract.methods.stakedAmount(account).call();
      setAllStaking(parseFloat(web3.utils.fromWei(allStaked,'ether')));
      let balance = BigInt(balanceOf);
      let rate = 0;
      for (const element of stakeData) {
        if (element[1] != 0) {
          try {
            const result = await contract.methods.stakingCalculate(element[0], element[1]).call();
            rate += Number(web3.utils.fromWei(result,'ether'))
          } catch (error) {
            console.error("Error calculating rate:", error);
          }
        }
        balance += BigInt(element[1]);
      }
      const finalBalance = web3.utils.fromWei(balance,'ether');
      const contractBalanceData = () =>{
        setStakeRate(rate);
        setUserNowBalance(web3.utils.fromWei(balanceOf,'ether')); 
        setUserTotalBalance(finalBalance);
        setUserStaked((finalBalance - web3.utils.fromWei(balanceOf,'ether')))
      }
      contractBalanceData()
    } catch (error) {
        console.error("User denied account access");
    }
  }


  return (
    <MetaMaskContext.Provider 
    value={{ 
      connect,
      disconnect,
      account,
      connected,
      hideAddress,
      getMainBalance,
      userUSDTBalance,
      userETHBalance,
      getContractBalance,
      userTotalBalance,
      userNowBalance,
      errorLog,
      web3,
      contract,
      userStaked,
      allStaking,
      stakeRate,
      contractAddress,
      usdtcontractAddress,
      USDTcontract
      }}>
      {children}
    </MetaMaskContext.Provider>
  );
};
