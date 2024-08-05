import React, { useEffect, useState } from 'react'
import Login from './Login'
import './AuthBody.css';
import { Constants, MODES } from '../../Helper/Helper';
import Forget from './Forget';
import Otp from './Otp';
import Update from './Update';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const AuthBody = () => {
   const [component,setComponent]=useState(Constants.LOGIN)
   const [otp,setOTP] = useState('');
   const [updateData,setUpdateData]=useState({});
   const auth=useSelector(x=> x.auth);
   const theme=useSelector(x=>x.theme);
   const navigate=useNavigate();
   useEffect(()=>{
      if(auth.isAuth){
        navigate('/')
      }
   },[])

  return (
 <div className="authbody">
 <div className="left">
    <img src={require(`../../Assests/images/${theme.mode === MODES.LIGHT ? 'lightdashboard.png':'darkdashboard.png' }`)} alt="DashboardLight" />
 </div>
 <div className="right">
 {
   (()=>{
      if(component===Constants.LOGIN) return  <Login setComponent={setComponent}/>
      else if(component===Constants.FORGOT) return <Forget setComponent={setComponent} setOTP={setOTP} setUpdateData={setUpdateData} />
      else if(component===Constants.OTP) return <Otp setComponent={setComponent} trueOtp={otp} />
      else if(component===Constants.UPDATE_PASSWORD) return <Update setComponent={setComponent} updateData={updateData} setUpdateData={setUpdateData} setOTP={setOTP} />
   })()
 }
 </div>
 </div>
  )
}

export default AuthBody
