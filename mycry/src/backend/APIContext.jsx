import React, { createContext, useState, useEffect,useRef,useContext,useCallback } from 'react';
import {apiInstance,apiAuthInstance} from '../components/api/apiSend';
import { setCookie, getCookie, removeCookie } from '../components/setcookie';
import Decimal from 'decimal.js'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AuthContext from '../components/auth/authContext';
import { useIntl } from 'react-intl';

export const APIContext = createContext();

export const APIContextProvider = ({ children }) => {
    const intl = useIntl();
    const swalWithReact = withReactContent(Swal);
    const {logoutUser,updateToken,user} = useContext(AuthContext);
    const [userAddress,setUserAddress] = useState(0)
    const [userETHBalance, setUserETHBalance] = useState(0);
    const [userUSDTBalance, setUserUSDTBalance] = useState(0);
    const [userTotalBalance,setUserTotalBalance] = useState(0);
    const [userNowBalance,setUserNowBalance] = useState(0);
    const [currentUSDTPrice, setCurrentUSDTPrice] = useState(null);
    const [errorLog,setErrorLog] = useState();
    const [nowToken, setNowToken] = useState('ETH');
    const [allStaking,setAllStaking] = useState('載入中');
    const [stakeRate,setStakeRate] = useState('載入中');
    const [userStaked,setUserStaked] = useState(0);
    const [poolPersent,setPoolPersent] = useState('載入中');
    const [rateRewards,setrateRewards] = useState('載入中');
    const [totalRewards,setTotalRewards] = useState('載入中');
    const [dataLock,setDataLock] = useState(false)

    const maxInput = useRef(null);
    const calcDoge = useRef(null);
    // console.log("APIb")
    //1次
    useEffect(() => {
      if(user){
        const getNewData = () => {
          refreshBalance()
          getUSDUSDTPrice()
        }
        getNewData()
        const intervalId = setInterval(() => {
          getUSDUSDTPrice()
        }, 30000); // 1000ms = 1 秒
    
        return () => clearInterval(intervalId);
      }
    }, [user]);

    useEffect(()=>{
      if(dataLock){
        const setRewardsData = () => {
          setrateRewards(stakeRate != Number((userStaked).toFixed(4)) ? ((stakeRate / (userStaked) - 1) / 100).toFixed(6) : 0)
          setTotalRewards(stakeRate != Number((userStaked).toFixed(4)) ? parseFloat((stakeRate - userStaked).toFixed(4)) : 0)
        }
        setRewardsData()
      }
    },[userStaked,stakeRate])

    useEffect(()=>{
      if(dataLock){
        // console.log(poolPersent,userStaked,allStaking)
        setPoolPersent(allStaking != '載入中' && userStaked ? Number((userStaked / allStaking * 100).toFixed(2)) : 0)
      }
    },[userStaked,allStaking])

    // const initialState = {
    //   ethAddress: '',
    //   ethBalance: 0,
    //   usdtBalance: 0,
    //   totalBalance: 0,
    //   nowBalance: 0,
    //   staked: 0,
    // };
    
    // const reducer = (state, action) => {
    //   switch (action.type) {
    //     case 'SET_USER_DATA':
    //       return {
    //         ...state,
    //         ethAddress: action.payload.ethAddress,
    //         ethBalance: parseFloat(parseFloat(action.payload.ethBalance).toFixed(6)),
    //         usdtBalance: parseFloat(parseFloat(action.payload.usdtBalance).toFixed(6)),
    //         totalBalance: parseFloat((new Decimal(action.payload.staked).add(new Decimal(action.payload.tokenBalance))).toFixed(6)),
    //         nowBalance: parseFloat(parseFloat(action.payload.tokenBalance).toFixed(6)),
    //         staked: parseFloat(parseFloat(action.payload.staked).toFixed(6)),
    //       };
    //     default:
    //       return state;
    //   }
    // };
    // const [state, dispatch] = useReducer(reducer, initialState);

    const setUserData = (data,state) => {
    //   dispatch({
    //     type: 'SET_USER_DATA',
    //     payload: {
    //       ethAddress: data['datas']['ethAddress'],
    //       ethBalance: data['datas']['ethBalance'],
    //       usdtBalance: data['datas']['usdtBalance'],
    //       staked: data['datas']['staked'],
    //       tokenBalance: data['datas']['tokenBalance'],
    //     },
    //   });

      setUserAddress(data['datas']['ethAddress']);
      setUserETHBalance(parseFloat(parseFloat(data['datas']['ethBalance']).toFixed(6)));
      setUserUSDTBalance(parseFloat(parseFloat(data['datas']['usdtBalance']).toFixed(6)));
      setUserTotalBalance(parseFloat((new Decimal(data['datas']['staked']).add(new Decimal(data['datas']['tokenBalance']))).toFixed(6)));
      setUserNowBalance(parseFloat(parseFloat(data['datas']['tokenBalance']).toFixed(6)));
      setUserStaked(parseFloat(parseFloat(data['datas']['staked']).toFixed(6)));
      if(state === 'new'){
        // console.log(data['allStaking'])
        setStakeRate(parseFloat(parseFloat(data['rate']).toFixed(6)))
        setAllStaking(parseFloat(parseFloat(data['allStaking']).toFixed(6)))
        setDataLock(true)
      }
  };


        

    const getInitUserDatas = async ()  => {
        try{
            const response = await apiAuthInstance.get('getUserAddressDatas/');
            const data = response.data;
            setUserData(data,'old');
            // setUserAddress(data['datas']['ethAddress'])
            // setUserETHBalance(parseFloat(parseFloat(data['datas']['ethBalance']).toFixed(6)))
            // setUserUSDTBalance(parseFloat(parseFloat(data['datas']['usdtBalance']).toFixed(6)))
            // setUserTotalBalance(parseFloat((new Decimal(data['datas']['staked']).add(new Decimal(data['datas']['tokenBalance']))).toFixed(6)))
            // setUserNowBalance(parseFloat(parseFloat(data['datas']['tokenBalance']).toFixed(6)))
            // setUserStaked(parseFloat(parseFloat(data['datas']['staked']).toFixed(6)))
        }catch(e){
            if(e == 'Token 已過期'){
                try{
                  updateToken()
                }catch{
                  logoutUser()
                }
              }
        }
    }
    const refreshBalance = async ()  => {
      try{
          const response = await apiAuthInstance.get('refreshBalance/');
          const data = response.data;
          // setUserAddress(data['datas']['ethAddress'])
          // setUserETHBalance(parseFloat(parseFloat(data['datas']['ethBalance']).toFixed(6)))
          // setUserUSDTBalance(parseFloat(parseFloat(data['datas']['usdtBalance']).toFixed(6)))
          // setUserTotalBalance(parseFloat((new Decimal(data['datas']['staked']).add(new Decimal(data['datas']['tokenBalance']))).toFixed(6)))
          // setUserNowBalance(parseFloat(parseFloat(data['datas']['tokenBalance']).toFixed(6)))
          // setUserStaked(parseFloat(parseFloat(data['datas']['staked']).toFixed(6)))
          // setStakeRate(parseFloat(parseFloat(data['rate']).toFixed(6)))
          // setAllStaking(parseFloat(parseFloat(data['allStaking']).toFixed(6)))
          // setDataLock(true)
          setUserData(data,'new');

      }catch(e){
          console.log(e)
      }
  }
    const getUSDUSDTPrice = async ()  => {
      try{
          const response = await apiInstance.get('getUSDUSDTPrice/');
          const data = response.data;
          setCurrentUSDTPrice(data['price'])
      }catch(e){
          console.log(e)
      }
   }
   


    const buyTokenWithETH = async ()  => {
      var buyAmount = maxInput.current.value;

      const playAmount = buyAmount * 10;
      const htmlMessage = intl.formatMessage({
        id: 'alert.html.buyTokenWithETH.message',defaultMessage: '您即將花費 {buyAmount} E 購買 {playAmount} $PLAY'},
        {buyAmount,playAmount}
      );
      const warningMessage = intl.formatMessage({
        id: 'alert.html.buyToken.warning',
        defaultMessage: '請注意，匯率隨時間變動，實際收到數量可能會有誤差'
      });

      if (buyAmount){
        swalWithReact.fire({
          title: intl.formatMessage({ id: 'alert.title.transConfirm', defaultMessage: `交易確認` }),
          // html:`您即將花費${buyAmount} E購買 ${buyAmount * 10} $PLAY<br><br><p class='text-red-500'>請注意，匯率隨時間變動，實際收到數量可能會有誤差</p>`,
          html: `<p>${htmlMessage}</p><br/><p class="text-red-500">${warningMessage}</p>`,
          icon:'warning',
          background: '#FFF5E9',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: intl.formatMessage({ id: 'alert.confirmButton', defaultMessage: '確認' }),
          cancelButtonText: intl.formatMessage({ id: 'alert.cancelButton', defaultMessage: '取消' })
        })
        .then(async (res)=>{
          if(res.isConfirmed){

            swalWithReact.fire({
              title: intl.formatMessage({ id: 'alert.title.transing', defaultMessage: '交易進行中，請稍後' }),
              html: "",
              imageUrl: '/icon/playdogelogo.png',
              imageHeight: 188,
              imageWidth: 488,
              allowOutsideClick: false,
              allowEscapeKey: false,
            });
            swalWithReact.showLoading();
            try{
              const response = await apiAuthInstance.post('buyTokenWithETH/',{
                payAmount:buyAmount,
                payToken:nowToken
              });
              const data = response.data;
              var title,icon,html;
              if(data){
                title = intl.formatMessage({ id: 'alert.title.success', defaultMessage: '交易成功' }),
                html = `${data['tx']}`
                icon = 'success'
                setErrorLog('')
                refreshBalance()
              }
              // console.log(data)

            }catch(e){
                console.log(e)
                var error = e['response']['data']['payAmount'] ? e['response']['data']['payAmount'] : e['response']['data']['message']
                setErrorLog(error)
                title = intl.formatMessage({ id: 'alert.title.failed', defaultMessage: '交易失敗' }),
                html = `<p class='text-red-500'>${error}</p>`
                icon = 'error'
            }
            swalWithReact.fire({
              title: title,
              html:html,
              icon:icon,
              background: '#FFF5E9',
              // showCancelButton: true,
              confirmButtonColor: '#3085d6',
              // cancelButtonColor: '#d33',
              confirmButtonText: intl.formatMessage({ id: 'alert.confirmButton', defaultMessage: '確認' }),
              // cancelButtonText: intl.formatMessage({ id: 'alert.cancelButton', defaultMessage: '取消' })
            })


          }
        })
      }
      else{
        setErrorLog('CouldNotBeNull')
      }
      
    }

    const buyTokenWithUSDT = async ()  => {
      var buyAmount = maxInput.current.value;

      const playAmount = parseFloat(buyAmount / currentUSDTPrice).toFixed(6)
      const htmlMessage = intl.formatMessage({
        id: 'alert.html.buyTokenWithUSDT.message',defaultMessage: '您即將花費 {buyAmount} E 購買 {playAmount} $PLAY'},
        {buyAmount,playAmount}
      );
      const warningMessage = intl.formatMessage({
        id: 'alert.html.buyToken.warning',
        defaultMessage: '請注意，匯率隨時間變動，實際收到數量可能會有誤差'
      });

      if (buyAmount){
        swalWithReact.fire({
          title: intl.formatMessage({ id: 'alert.title.transConfirm', defaultMessage: `交易確認` }),
          html: `<p>${htmlMessage}</p><br/><p class="text-red-500">${warningMessage}</p>`,
          // html:intl.formatMessage({ id: 'alert.html.buyTokenWithUSDT', defaultMessage: `您即將花費${buyAmount} U購買 ${parseFloat(buyAmount / currentUSDTPrice).toFixed(6)} $PLAY<br><br><p class='text-red-500'>請注意，匯率隨時間變動，實際收到數量可能會有誤差</p>` }),
          icon:'warning',
          background: '#FFF5E9',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: intl.formatMessage({ id: 'alert.confirmButton', defaultMessage: '確認' }),
          cancelButtonText: intl.formatMessage({ id: 'alert.cancelButton', defaultMessage: '取消' })
        })
        .then(async (res)=>{
          if(res.isConfirmed){

            swalWithReact.fire({
              title: intl.formatMessage({ id: 'alert.title.transing', defaultMessage: '交易進行中，請稍後' }),
              html: "",
              imageUrl: '/icon/playdogelogo.png',
              imageHeight: 188,
              imageWidth: 488,
              allowOutsideClick: false,
              allowEscapeKey: false,
            });
            swalWithReact.showLoading();



            try{
              const response = await apiAuthInstance.post('buyTokenWithUSDT/',{
                payAmount:buyAmount,
                payToken:nowToken
              });
              const data = response.data;
              var title,icon,html;
              if(data){
                title = intl.formatMessage({ id: 'alert.title.success', defaultMessage: '交易成功' }),
                html = `${data['tx']}`
                icon = 'success'
                setErrorLog('')
                refreshBalance()
              }
              // console.log(data)
            }catch(e){
                console.log(e)
                var error = e['response']['data']['payAmount'] ? e['response']['data']['payAmount'] : e['response']['data']['message']
                setErrorLog(error)
                title = intl.formatMessage({ id: 'alert.title.failed', defaultMessage: '交易失敗' }),
                html = `<p class='text-red-500'>${error}</p>`
                icon = 'error'
            }

            swalWithReact.fire({
              title: title,
              html:html,
              icon:icon,
              background: '#FFF5E9',
              confirmButtonColor: '#3085d6',
              confirmButtonText: intl.formatMessage({ id: 'alert.confirmButton', defaultMessage: '確認' }),
            })
          }
        })
      }
      else{
        setErrorLog('CouldNotBeNull')
      }
    }
    
    const openInput = () => {
      swalWithReact.fire({
        // title: '請輸入您要質押的數量',
        title: intl.formatMessage({ id: 'alert.title.stakeAmount', defaultMessage: '請輸入您要質押的數量' }),
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
        if (result.value && result.value <= userNowBalance) {
          initStake(result.value);
        } else {
          swalWithReact.fire({
            // title: '請輸入數量',
            title: intl.formatMessage({ id: 'alert.title.stakeAmountError', defaultMessage: '請輸入質押數量' }),
            icon: 'warning',
            background: '#FFF5E9',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: intl.formatMessage({ id: 'alert.confirmButton', defaultMessage: '確認' }),
          });
        }
      });
    }

    const initStake = (stakeValue) => {
      if(stakeValue){
        swalWithReact.fire({
          title: intl.formatMessage({ id: 'alert.title.stakeCheck', defaultMessage: `您即將質押${stakeValue}顆$PLAY` },{stakeValue}),
          // html: "",
          imageUrl: '/icon/playdogelogo.png',
          imageHeight: 188,
          imageWidth: 188,
          background: '#FFF5E9',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: intl.formatMessage({ id: 'alert.confirmButton', defaultMessage: '確認' }),
          cancelButtonText: intl.formatMessage({ id: 'alert.cancelButton', defaultMessage: '取消' })
        }).then(async (result)=>{
          if (result.isConfirmed) {
            try{
              swalWithReact.fire({
                title: intl.formatMessage({ id: 'alert.title.transing', defaultMessage: '交易進行中，請稍後' }),
                html: "",
                imageUrl: '/icon/playdogelogo.png',
                imageHeight: 188,
                imageWidth: 488,
                allowOutsideClick: false,
                allowEscapeKey: false,
              });
              swalWithReact.showLoading();
              const response = await apiAuthInstance.post('userStake/',{
                stakeAmount:stakeValue,
              });
              const data = response.data;
              var title,icon,html;
              if(data){
                title = intl.formatMessage({ id: 'alert.title.success', defaultMessage: '交易成功' }),
                html = `${data['tx']}`
                icon = 'success'
                setErrorLog('')
                refreshBalance()
              }
            }catch(e){
                console.log(e)
                var error = e['response']['data']['stakeAmount'] ? e['response']['data']['stakeAmount'] : e['response']['data']['message']
                setErrorLog(error)
                title = intl.formatMessage({ id: 'alert.title.failed', defaultMessage: '交易失敗' }),
                html = `<p class='text-red-500'>${error}</p>`
                icon = 'error'
            }
            swalWithReact.fire({
              title: title,
              html:html,
              icon:icon,
              background: '#FFF5E9',
              confirmButtonColor: '#3085d6',
              confirmButtonText: intl.formatMessage({ id: 'alert.confirmButton', defaultMessage: '確認' }),
            })
          }
        })
      }else{
        swalWithReact.fire({
          title: intl.formatMessage({ id: 'alert.title.stakeAmountError', defaultMessage: '請輸入質押數量' }),
          // html: "",
          imageUrl: '/icon/playdogelogo.png',
          imageHeight: 188,
          imageWidth: 188,
          background: '#FFF5E9',
          // showCancelButton: true,
          confirmButtonColor: '#3085d6',
          // cancelButtonColor: '#d33',
          confirmButtonText: intl.formatMessage({ id: 'alert.confirmButton', defaultMessage: '確認' }),
          // cancelButtonText: intl.formatMessage({ id: 'alert.cancelButton', defaultMessage: '取消' })
        })
      }
    }

    const withdrawStake = async() => {
      if (userStaked != 0){
        swalWithReact.fire({
          // title: `您有${parseFloat(userStaked.toFixed(6))}顆$PLAY質押可提領`,
          title: intl.formatMessage({ id: 'alert.title.withdrawStake', defaultMessage: `您有${userStaked}顆$PLAY質押可提領` },{userStaked:parseFloat(userStaked.toFixed(6))}),
          // html: "",
          imageUrl: '/icon/playdogelogo.png',
          imageHeight: 188,
          imageWidth: 188,
          background: '#FFF5E9',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: intl.formatMessage({ id: 'alert.confirmButton', defaultMessage: '確認' }),
          cancelButtonText: intl.formatMessage({ id: 'alert.cancelButton', defaultMessage: '取消' })
        }).then(async (result)=>{
          if (result.isConfirmed) {
            try{
              swalWithReact.fire({
                title: intl.formatMessage({ id: 'alert.title.transing', defaultMessage: '交易進行中，請稍後' }),
                html: "",
                imageUrl: '/icon/playdogelogo.png',
                imageHeight: 188,
                imageWidth: 488,
                allowOutsideClick: false,
                allowEscapeKey: false,
              });
              swalWithReact.showLoading();
              const response = await apiAuthInstance.post('userWithdrawStake/',{
                withdrawAmount:userStaked,
              });
              const data = response.data;
              var title,icon,html;
              if(data){
                title = intl.formatMessage({ id: 'alert.title.success', defaultMessage: '交易成功' }),
                html = `${data['tx']}`
                icon = 'success'
                setErrorLog('')
                refreshBalance()
              }
            }catch(e){
                console.log(e)
                var error = e['response']['data']['withdrawAmount'] ? e['response']['data']['withdrawAmount'] : e['response']['data']['message']
                setErrorLog(error)
                title = intl.formatMessage({ id: 'alert.title.failed', defaultMessage: '交易失敗' }),
                html = `<p class='text-red-500'>${error}</p>`
                icon = 'error'
            }
            swalWithReact.fire({
              title: title,
              html:html,
              icon:icon,
              background: '#FFF5E9',
              confirmButtonColor: '#3085d6',
              confirmButtonText: intl.formatMessage({ id: 'alert.confirmButton', defaultMessage: '確認' }),
            })
          }
        })
      }else{
        swalWithReact.fire({
          // title: `您沒有可提領的$PLAY`,
          title: intl.formatMessage({ id: 'alert.title.withdrawError', defaultMessage: '您沒有可提領的$PLAY' }),
          // html: "",
          imageUrl: '/icon/playdogelogo.png',
          imageHeight: 188,
          imageWidth: 188,
          background: '#FFF5E9',
          // showCancelButton: true,
          confirmButtonColor: '#3085d6',
          // cancelButtonColor: '#d33',
          confirmButtonText: intl.formatMessage({ id: 'alert.confirmButton', defaultMessage: '確認' }),
          // cancelButtonText: intl.formatMessage({ id: 'alert.cancelButton', defaultMessage: '取消' })
        })
      }     
    }



  return (
    <APIContext.Provider 
    value={{ 
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
      totalRewards,
      }}>
      {children}
    </APIContext.Provider>
  );
};
