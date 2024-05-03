import React, { useState } from 'react';
import { Button, Input } from '../Form';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { auth } from '../../firebase';
import { updatePassword } from 'firebase/auth';

function ChangePassword() {
  const [pass, setPass]=useState('');
  const [pass2, setPass2]=useState('');

  const handelpasswordchange=()=>{
if(pass&& (pass===pass2)){
  const user = auth.currentUser;
console.log(user)
const newPassword = pass;
  if (user) {
    updatePassword(user, newPassword)
      .then(() => {
        toast("Password updated successfully");
      })
      .catch((error) => {
        console.log(error.message)
        toast(error.message);
      });
  } else {
    toast("No user is currently signed in.");
  }
}
else{
  toast('Type password');
}

  };
  return (
    <div className="flex-colo gap-4">
      {/* old password */}
      <Input label="New Password" value={pass} onChange={e=>setPass(e.target.value)}  color={true} type="password" />
      {/* new password */}
      <Input label="Confirm Password" value={pass2} onChange={e=>setPass2(e.target.value)} color={true} type="password" />
      {/* confirm password */}

      {/* submit */}
      <Button
        label={'Save Changes'}
        Icon={HiOutlineCheckCircle}
        onClick={handelpasswordchange}
      />
    </div>
  );
}

export default ChangePassword;
