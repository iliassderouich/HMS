import React, { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { onValue, ref } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaLock, FaUser } from 'react-icons/fa';

function Login() {
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");
  const navigate = useNavigate();
const [isloding, setIsloding]=useState(false);



  useEffect(()=>{
    const unregisterAuthObserver = onAuthStateChanged(auth, user => {
        if (user) {
          onValue(ref(db, `User/${user.uid}`), snapshot => { // Assuming db is defined elsewhere
            if (snapshot.exists()) {
              if(snapshot.val().Role==="Admin"){
                //navigate('/admin');
              }
              else{
              auth.signOut();
              navigate('/');
              }
            }
          });
        }
      });
    
      return () => unregisterAuthObserver();
        },[navigate]);

  
const handelLogins =(event)=>{
          event.preventDefault();
   
    if (email && password) {
      setIsloding(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {

    const formValuesencode = btoa(JSON.stringify({email, password}));
    localStorage.setItem("AuthKey", formValuesencode);
          // Signed in
          const user = userCredential.user;
          console.log(user);
          setIsloding(false);
          navigate('/admin');

        })
        .catch((error) => {
          setIsloding(false);
          //const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
          toast(errorMessage);
        });
    } else {
      toast("fill all Info");
    }

  };


  return (
    <div className="authlogin_pages">
        <div className={`wrapper show`}>
            <div className="form-box login">
                <form onSubmit={handelLogins}>
                    <h1>Admin Login</h1>
                    <div className="input-box">
                        <input type="text" 
                        value={email}  onChange={e=>setEmail(e.target.value)}
                        placeholder='Email' required />
                        <FaUser className='icon'/>
                    </div>
                    
                    <div className="input-box">
                        <input type="password" 
                        value={password}  onChange={e=>setPassword(e.target.value)}
                        placeholder='Password' required />
                        <FaLock className='icon'/>
                    </div>

                

                    <button type='submit' disabled={isloding}>Login</button>
                </form>
            </div></div>
      <ToastContainer />
    </div>
  );
}

export default Login;
