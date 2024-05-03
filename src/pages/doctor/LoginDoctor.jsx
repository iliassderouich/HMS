import React, { useState, useEffect } from 'react';
import '../../components/Css/LoginDoctor.css';
import { FaUser, FaLock, FaIdCard } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { onValue, ref } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginDoctor = () => {
  const navigate = useNavigate();
  const [email, setEmail]=useState('');
  const [pass, setPass]=useState('');
  const [isloding, setIsloding]=useState(false);
  const [showForgotPasswordBox, setShowForgotPasswordBox] = useState(false);

  const toggleForgotPasswordBox = () => {
    setShowForgotPasswordBox(!showForgotPasswordBox);
  };

  useEffect(() => {
    let timeout;
  
    if (showForgotPasswordBox) {
      timeout = setTimeout(() => {
        setShowForgotPasswordBox(false);
      }, 4000); 
    }
  
    const unregisterAuthObserver = onAuthStateChanged(auth, user => {
      if (user) {
        onValue(ref(db, `User/${user.uid}`), snapshot => { 
          if (snapshot.exists()) {
            navigate('/doctor');
          }
        });
      }
    });
  
    // Combine cleanup functions
    return () => {
      clearTimeout(timeout);
      unregisterAuthObserver();
    };
  }, [showForgotPasswordBox, navigate]);

  const handelLogins =(event)=>{
    event.preventDefault();
    if (email && pass) {
      setIsloding(true);
      signInWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          setIsloding(false);
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
    <div className={'wrapper'}>
      <div className="form-box login">
        <form onSubmit={handelLogins}>
          <h1>Doctor Login</h1>
          <div className="input-box">
            <input type="text" placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} required />
            <FaUser className='icon' />
          </div>

          <div className="input-box">
            <input type="number" placeholder='Doctor ID' required />
            <FaIdCard className='icon' />
          </div>

          <div className="input-box">
            <input type="password" placeholder='Password'  value={pass} onChange={e=>setPass(e.target.value)} required />
            <FaLock className='icon' />
          </div>

          <div className="remember-forgot">
            <label><input type="checkbox" />Remember me</label>
            <Link to="" onClick={toggleForgotPasswordBox}>Forgot password?</Link>
          </div>

          <button type='submit' disabled={isloding}>Login</button>

          {showForgotPasswordBox && (
            <div className="forgot-password-box">
              <p>For security reasons, password resets are not available directly on the website. Please contact us at <a href="mailto:doctor@rodoil.com">doctor@rodoil.com</a> for assistance. Thank you.</p>
            </div>
          )}
        </form>
      </div>
    </div><ToastContainer />
    </div>
  );
};

export default LoginDoctor;