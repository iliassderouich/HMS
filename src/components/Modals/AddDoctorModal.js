import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { Button, Input } from '../Form';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import Uploader from '../Uploader';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { ref, update } from 'firebase/database';

function AddDoctorModal({ closeModal, isOpen, doctor, datas }) {
  const [image, setImage] = useState(null);
  const [fullname, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isloding, setIsloding]=useState(false);


  useEffect(()=>{
    if(datas){
setImage(datas?.avater);
setFullName(datas.Surename);
setEmail(datas.email);
setPhone(datas.Phone);
    }
  },[datas]);

  const onSubmit = async () => {
  
  try{
    setIsloding(true);

if(datas){
  await update(ref(db, `User/${datas.id}`), {
    avater: image,
    Surename: fullname,
    Phone: phone,
    email: email,
});
toast("Update Sucess");
}

else{
    const Authkey =localStorage.getItem('AuthKey');
    if(image&&fullname&&phone&&email&&pass&&Authkey){
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
                        Surename: fullname,
                        Phone: phone,
                        email: email,
                        Role: doctor?"doctor":"receptionists",
                        Day: day,
                        Month: month,
                        Year: year,
                        ms: Date.now()
                    });
  
            var AdminAuth =  atob(localStorage.getItem('AuthKey'));
          var AdminAuthJson= JSON.parse(AdminAuth);
      await signInWithEmailAndPassword(auth, AdminAuthJson.email, AdminAuthJson.password);
      closeModal(false);
                  
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
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={doctor ? 'Add Doctor' : datas?.id ? 'Edit Stuff' : 'Add Stuff'}
      width={'max-w-3xl'}
    >
      <div className="flex gap-3 flex-col col-span-6 mb-6">
        <p className="text-sm">Profile Image</p>
        <Uploader setImage={e=>setImage(e)} image={image} />
      </div>

      <div className="flex-colo gap-6">
        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <Input label="Full Name"  value={fullname} onChange={e=>setFullName(e.target.value)} color={true} placeholder="John Doe" />

          <Input label="Email"  value={email} onChange={e=>setEmail(e.target.value)} color={true} />
        </div>

        <div className={datas?"grid  gap-4 w-full":"grid sm:grid-cols-2 gap-4 w-full"}>
         
          <Input label="Phone Number"  value={phone} onChange={e=>setPhone(e.target.value)} color={true} />
         {!datas&&<Input label="Password"  value={pass} onChange={e=>setPass(e.target.value)} color={true} />}
        </div>

       

      

        {/* buttones */}
        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={closeModal}
            className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
          >
            Cancel
          </button>
          <Button label="Save" Icon={HiOutlineCheckCircle} onClick={onSubmit} disabled={isloding}/>
        </div>
      </div>
    </Modal>
  );
}

export default AddDoctorModal;
