import React,{useEffect} from 'react'
import { Route ,Routes, useNavigate} from 'react-router-dom'
import AuthBody from './components/Authentication/AuthBody';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard/Dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './Reducers/AuthReducer';
import { COLORS } from './Helper/Helper';
import { toggleLight } from './Reducers/Theme';
import Apply from './components/Dashboard/Job/Apply';
import ApplyForm from './components/Dashboard/Job/ApplyForm';
import Display from './components/Dashboard/Display/Display';

const App = () => {
  const auth=useSelector(x=> x.auth);
  const theme=useSelector (x=>x.theme);
   const dispatch=useDispatch();
   useEffect(()=>{
    const currDate = new Date(Date.now()) 
    if(!auth.isRemember && currDate.getTime() >= auth.remember_token)dispatch(logout())
// Handling theme
dispatch(toggleLight());
      Object.keys(COLORS.LIGHT).forEach((x) =>
        document.documentElement.style.setProperty(x, COLORS.LIGHT[x])
      );

   },[])
  return (
    <div className='App'>
      <Routes>
        <Route exact path='/auth' element={<AuthBody/>}/>
        <Route exact path='/' element={<Dashboard/>}/>
        <Route exact path='/apply' element={<Apply/>} />
        <Route exact path='/apply/:id' element={<ApplyForm/>} />
        <Route exact path='/profile' element={<Display />} />
      </Routes>
      <Toaster position="top-right"/>
    </div>
  )
}

export default App

