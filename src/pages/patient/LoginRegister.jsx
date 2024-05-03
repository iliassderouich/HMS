import React, { useEffect, useState } from 'react';
import '../../components/Css/LoginRegister.css';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaRegUser  } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { onValue, ref, update } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const LoginRegister = () => {
    const navigate = useNavigate();
    const [username, setUserName]=useState('');
    const [sureName, setSureName]=useState('');
    const [phone, setPhone]=useState('');
    const [regemail, setRegEmail]=useState('');
    const [regpass, setRegPass]=useState('');

    const [email, setEmail]=useState('');
    const [pass, setPass]=useState('');

    const [searchparms]= useSearchParams('');
    const register =  searchparms.get('reg');
    const [action, setAction] = useState('');
    const [isloding, setIsloding]=useState(false);
    const [agree, setAgree]=useState(false);

    useEffect(()=>{
setAction(register?" active":"");

const unregisterAuthObserver = onAuthStateChanged(auth, user => {
    if (user) {
      onValue(ref(db, `User/${user.uid}`), snapshot => { // Assuming db is defined elsewhere
        if (snapshot.exists()) {
          navigate('/patient');
        }
      });
    }
  });

  return () => unregisterAuthObserver();
    },[navigate, register]);

    
    const registerLink = () => {
        setAction(' active');
    };

    const loginLink = () => {
        setAction('');
    };

 
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

const handelRegister= async(event)=>{
        event.preventDefault();
try{
setIsloding(true);
if(username&&sureName&&phone&&regemail&&regpass&&agree){
    const userCredential = await createUserWithEmailAndPassword(auth, regemail, regpass);
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
    const user = userCredential.user;
    await update(ref(db, `User/${user.uid}`), {
                    id: user.uid,
                    Username: username,
                    Surename: sureName,
                    Phone: phone,
                    email: regemail,
                    Role: "patient",
                    Day: day,
                    Month: month,
                    Year: year,
                    ms: Date.now()
                })}
else{
    setIsloding(false);
 toast(!agree?"Check agree to the terms & conditions":"Fill all info");
}
}
catch (error) {
    setIsloding(false);
    // Check for specific error codes and handle them accordingly
    if (error.code === "auth/email-already-in-use") {
      toast("Email is already in use!");
    } else if (error.code === "auth/weak-password") {
      toast("Password is too weak!");
    } else {
      // Log the full error object for debugging purposes
      console.error("Signup error:", error);
      toast("An error occurred during signup. Please try again later.");
    }
  }
};



    return(
        <div className="authlogin_pages">
        <div className={`wrapper${action}`}>
            <div className="form-box login">
                <form onSubmit={handelLogins}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" 
                        value={email}  onChange={e=>setEmail(e.target.value)}
                        placeholder='Email' required />
                        <FaUser className='icon'/>
                    </div>
                    
                    <div className="input-box">
                        <input type="password" 
                        value={pass}  onChange={e=>setPass(e.target.value)}
                        placeholder='Password' required />
                        <FaLock className='icon'/>
                    </div>

                    <div className="remember-forgot">
                        <label><input type="checkbox" />Remember me</label>
                        <Link to="">Forgot password?</Link>
                    </div>

                    <button type='submit' disabled={isloding}>Login</button>

                    <div className="register-link">
                        <p>I don't have an account <Link to="" onClick={registerLink}>Register</Link></p>
                    </div>
                </form>
            </div>
            


            <div className="form-box register">
                <form onSubmit={handelRegister}>
                    <h1>Registration</h1>
                    <div className="input-box">
                        <input type="text" 
                        value={username}  onChange={e=>setUserName(e.target.value)}
                        placeholder='Username'  required />
                        <FaUser className='icon'/>
                    </div>

                    <div className="input-box">
                        <input type="text" 
                         value={sureName}  onChange={e=>setSureName(e.target.value)}
                        placeholder='Name & Surname' required />
                        <FaRegUser  className='icon'/>
                    </div>


                    <div className="input-box">
                        <input type="tel"
                         value={phone}  onChange={e=>setPhone(e.target.value)}
                         placeholder='Phone number' maxLength={12} required />
                        <FaPhone className='icon'/>
                    </div>


                    <div className="input-box">
                        <input type="email"
                         value={regemail}  onChange={e=>setRegEmail(e.target.value)}
                         placeholder='Email' required />
                        <FaEnvelope  className='icon'/>
                    </div>
                    
                    <div className="input-box">
                        <input type="password"
                         value={regpass}  onChange={e=>setRegPass(e.target.value)}
                         placeholder='Password' required />
                        <FaLock  className='icon'/>
                    </div>

                    <div className="remember-forgot">
                        <label><input type="checkbox" onClick={e=>setAgree(!agree)} />I agree to the terms & conditions</label>
                    </div>

                    <button type='submit' disabled={isloding}>Register</button>

                    <div className="register-link">
                        <p>I already have an account 
                            <Link onClick={loginLink}>Login</Link></p>
                    </div>
                </form>
            </div>



        </div>
        <ToastContainer />
        </div>
    );
};

export default LoginRegister;