import React, { useEffect, useState } from 'react';
import Uploder from '../Uploader';
import { sortsDatas } from '../Datas';
import { Button, DatePickerComp, Input, Select } from '../Form';
import { BiChevronDown } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { ref, update } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

function PersonalInfo({ myData, titles }) {
  const navigate = useNavigate();
  const [date, setDate] = React.useState(new Date());
  const [gender, setGender] = React.useState(sortsDatas.genderFilter[0]);
  const [image, setImage] = useState(null);
  const [sureName, setSureName]=useState('');
  const [phone, setPhone]=useState('');
  const [emphone, setEmPhone]=useState('');
  const [adress, setAdress]=useState('');
  const [email, setEmail]=useState('');
  const [pass, setPass]=useState('');
  const [isloding, setIsloding]=useState(false);


  useEffect(()=>{
if(myData){
  const foundGender = sortsDatas.genderFilter.find(item => item.name === myData.gender);
  setSureName(myData.Surename);
  setEmPhone(myData.EmPhone);
  setPhone(myData.Phone);
  setEmail(myData.email);
  setAdress(myData.Adress);
  setGender(foundGender?foundGender:gender);
  setImage(myData.avater);
  setDate(myData.dob?new Date(myData.dob):new Date());
}
else{
  console.log('myData')
}
  },[myData, gender]);
 
const handelsSaveaccount=async()=>{

  try{
    setIsloding(true);
if(myData){
  if(sureName&&phone&&email){
  await update(ref(db, `User/${myData.id}`), {
    avater: image,
    Surename: sureName,
    Phone: phone,
    EmPhone: emphone?emphone:"",
    Adress: adress?adress:"",
    email: email,
    gender: gender.name?gender.name:"Male",
    dob: date
  });
  toast('Update user Data');
}
else{
  toast('Fill all info');
}
}
else{
    const Authkey =localStorage.getItem('AuthKey');
    if(sureName&&phone&&emphone&&adress&&email&&pass&&gender.name!=="Gender..."&&Authkey){
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const date = new Date();
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
        const user = userCredential.user;
        await update(ref(db, `User/${user.uid}`), {
                        id: user.uid,
                        Username: "",
                        avater: image,
                        Surename: sureName,
                        Phone: phone,
                        EmPhone: emphone,
                        Adress: adress,
                        email: email,
                        Role: "patient",
                        gender: gender.name,
                        dob: date,
                        Day: day,
                        Month: month,
                        Year: year,
                        ms: Date.now()
                    });
  
            var AdminAuth =  atob(localStorage.getItem('AuthKey'));
          var AdminAuthJson= JSON.parse(AdminAuth);
      await signInWithEmailAndPassword(auth, AdminAuthJson.email, AdminAuthJson.password);
            navigate('/patients');
                  
                  }
    else{
        setIsloding(false);
     toast.error(!Authkey?"Try to Login agin Admin":"Fill all info");
    }
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


  return (
    <div className="flex-colo gap-4">
      {/* uploader */}
      <div className="flex gap-3 flex-col w-full col-span-6">
        <p className="text-sm">Profile Image</p>
        <Uploder setImage={e=>setImage(e)} image={image}/>
      </div>
     

      {/* fullName */}
      <Input label="Full Name" value={sureName} onChange={e=>setSureName(e.target.value)} color={true} type="text" />
      {/* phone */}
      <Input label="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)} color={true} type="tel" />
      {/* email */}
      <Input label="Email" value={email} onChange={e=>setEmail(e.target.value)} color={true} type="email" />
      {!titles && (
        <>
          {/* gender */}
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Gender</p>
            <Select
              selectedPerson={gender}
              setSelectedPerson={setGender}
              datas={sortsDatas.genderFilter}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {gender?.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
          {/* emergancy contact */}
          <Input label="Emergency Cotact" value={emphone} onChange={e=>setEmPhone(e.target.value)} color={true} type="tel" />
          {/* date */}
          <DatePickerComp
            label="Date of Birth"
            startDate={date}
            onChange={(date) => setDate(date)}
          />
          {/* address */}
          <Input label="Address"  value={adress} onChange={e=>setAdress(e.target.value)} color={true} type="text" />
          
          {!myData&&<Input label="Password"  value={pass} onChange={e=>setPass(e.target.value)} color={true} type="password" />}
        </>
      )}
      {/* submit */}
      <div className="grid grid-cols-1  gap-4 w-full">
        
        <Button
          label={'Save Changes'}
          Icon={HiOutlineCheckCircle}
          disabled={isloding}
          onClick={handelsSaveaccount}
        />
      </div>
    </div>
  );
}

export default PersonalInfo;
