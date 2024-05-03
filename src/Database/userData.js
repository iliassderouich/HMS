import { child, get, ref } from 'firebase/database';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const useUserData = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [userInter, setUserInter] = useState(false);

  useEffect(() => {
const userDataListener = onAuthStateChanged(auth, (user) => {
    if (user) { 
      setUserInter(true);
       get(child(ref(db), `User/${user.uid}`))
       .then(snapshot=>{
            if(snapshot.exists()){
                setUserData(snapshot.val());
                if(snapshot.val().Role!=="Admin"){
                  auth.signOut();
                  navigate('/');
                }
            }
            else{
              auth.signOut();
              if(!userInter){
                navigate('/');
               }
            }
            
        });
    }
    else{
      setUserData({userType: "gust"});
      if(!userInter){
       navigate('/');
      }
    }
    })
    return () => {
      userDataListener();
    };
  }, [navigate, userInter]);

  return userData;
};

export default useUserData;