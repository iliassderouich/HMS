import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db} from '../../firebase';
import { onValue, ref, update } from 'firebase/database';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAlluserData } from '../../Database';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link as ScrollLink } from 'react-scroll';


const DashboardReceptionist = () => {
    const navigate = useNavigate();
    const [userID, setUserID]=useState();
    const [myData, setMyData]=useState();
    const [allappointment, setAllappointment]=useState();

    const alluserData = useAlluserData();

    const Alldoctor = alluserData?.filter(member => member.Role === "doctor").sort((a, b) => b.ms - a.ms);
    const [AllPatients, setAllPatients] = useState();
    useEffect(()=>{
        onAuthStateChanged(auth, user => {
            if (user) {
            ////User info
              setUserID(user.uid);
              onValue(ref(db, `User/${user.uid}`), snapshot => {
                if (snapshot.exists()) {
                    if(snapshot.val().Role==="receptionists"){
                        setMyData(snapshot.val());
                      }
                      else{
                      signOut(auth);
                      navigate('/');
                      }
                }
              });

         ////appointment Data
         onValue(ref(db, `Appointment`), snapshot => {
            if (snapshot.exists()) {
            const records = [];
            snapshot.forEach(childsnap=>{
                records.push(childsnap.val())
            })
             records.sort((a, b) => b.id - a.id)
              setAllappointment(records);
            }
          });
        
            }
            else{
                navigate('/receptionist-auth');
            }
          });

    //////
    setAllPatients(alluserData?.filter(member => member.Role === "patient").sort((a, b) => b.ms - a.ms) )
  },[alluserData, navigate]);

    /////Logout
    const handelLogout=()=>{
        signOut(auth).then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });

    };
    


    const handelApproveappionmeient=async(appoinData)=>{
      if(appoinData?.doctorID){
      const selectDoctor = Alldoctor.filter(item=> item.id===appoinData.doctorID);
      ////Update Appointment
     await update(ref(db, `Appointment/${appoinData.id}`), {
          doctorID: selectDoctor[0].id,
          doctorName: selectDoctor[0].Surename,
          status: "Approved"
      });


const ms = Date.now();
////Notify Patient
  await update(ref(db, `User/${appoinData.patientID}/Notify/${ms}`), {
         id: ms,
         message: `Approve your Appointment ID: ${appoinData.id}`,
         status: true
      });

////Notify doctor
await update(ref(db, `User/${selectDoctor[0].id}/Notify/${ms}`), {
  id: ms,
  message: `New Appointment hereID: ${appoinData.id}`,
  status: true
});

toast('Approve');

      }
      else{
        toast('Select Doctor');
      }
    };

/////Payment save
const handelpaymentsave=async(item)=>{
if(item.statuse&&item.amount&&item.method){
  const ms = Date.now();
  const date = new Date();
 const day = date.getDate();
   const month = date.getMonth() + 1;
  const year = date.getFullYear();
await update(ref(db, `Payment/${ms}`), {
  id: ms,
  amount: parseFloat(item.amount),
  method: item.method,
  status: item.statuse,

  receptionistID: userID,
  receptionistName: myData.Surename,
  receptionistAvater: myData.avater?myData.avater:"",
  receptionistPhone: myData.Phone?myData.Phone:"",

  patientID: item.id,
  patientName: item.Surename,
  patientAvater: item.avater?item.avater:"",
  patientPhone: item.Phone?item.Phone:"",

  Day: day,
  Month: month,
  Year: year
});
toast('update payment');
}
else{
  toast('fill all info')
}
};

///////
const handelCancelappionmeient=async(appoinData)=>{
   ////Update Appointment
   await update(ref(db, `Appointment/${appoinData.id}`), {
    status: "Cancel"
});
const ms = Date.now();
////Notify Patient
await update(ref(db, `User/${appoinData.patientID}/Notify/${ms}`), {
     id: ms,
     message: `Cancel your Appointment ID: ${alluserData.id}`,
     status: true
  });

toast('Cancel');
};


   
   ////Sva info
    const savePersonalInfo =async () => {
        const currentDate = new Date();
        const selectedDate = new Date(myData?.dob);
    
        if (selectedDate > currentDate) {
            alert("Date of birth cannot be in the future. Please select a valid date.");
            return;
        }
    
        try{
            await update(ref(db, `User/${userID}`), myData)
        toast("Update Sucess"); 
        }
        catch{
            toast("Try again");
        }
    };


    ///
    const handleChange = (index, key, value) => {
      const updatedAppointments = [...allappointment];
      updatedAppointments[index][key] = value;
      setAllappointment(updatedAppointments);
    };
    
    const handleamountstatusChange = (index, key, value) => {
      const updatedAllPatients = [...AllPatients];
      updatedAllPatients[index][key] = value;
      setAllPatients(updatedAllPatients);
    };
    
    
    

    return (
<div style={{background: "black"}}>
        <div id="wrapper">
        <nav id="nav">
          <ul>
          <li>
          <ScrollLink to="welcome" spy={true} smooth={true} offset={-30}duration={500}>
            <Link to="#welcome" class="active">Welcome</Link>
            </ScrollLink></li>
							<li><ScrollLink to="profile" spy={true} smooth={true} offset={-30}duration={500}>
                <Link to="#profile">Personal informations</Link></ScrollLink></li>
							<li><ScrollLink to="appointments" spy={true} smooth={true} offset={-30}duration={500}>
                <Link to="#appointments">Appointments</Link></ScrollLink></li>
							<li><ScrollLink to="payment" spy={true} smooth={true} offset={-30}duration={500}>
                <Link to="#payment">Payment</Link></ScrollLink></li>
							<li> <LogoutIcon onClick={handelLogout}/></li>
							
          </ul>
        </nav>
  
        <div id="main">
         
        <section id="welcome" className="main">
      <div className="spotlight">
        <div className="content">
          <header className="major">
            <div className="icon">
              <img src="images/Rodoil-logo.png" alt="site logo" style={{ width: "200px", height: "auto" }} />
            </div>
            <h2 className='wallcokffgft'>Welcome!</h2>
          </header>
          <p>“Receptionists are the gatekeepers of hospitality, welcoming the world with a smile and ensuring every encounter begins with warmth and efficiency.”</p>
          <ul className="actions"  style={{marginTop: '50px'}}>
            <li><ScrollLink to="appointments" spy={true} smooth={true} offset={-30}duration={500}>
              <Link to="#appointments" className="hkj3saveButton">Appointments</Link>
              </ScrollLink>
              </li>
          </ul>
        </div>
        <span className="image">
        <img src={myData?.avater ? myData?.avater : "images/user.png"} alt="" />
        </span>
      </div>
    </section>
  
  {/* Profile info */}
          <section id="profile" className="main special">
            <header className="major">
              <h2 className='wallcokffgft'>Personal information</h2>
            </header>
            <div id="personalInfo">
              <label htmlFor="name">Username:</label>
              <input type="text" 
              value={myData?.Username || ''} 
              onChange={(e) => setMyData(prevState => ({
               ...prevState,
               Username: e.target.value 
           }))} id="name" name="name"  />
              <label htmlFor="surname">Surname:</label>
              <input type="text" 
              value={myData?.Surename || ''} 
              onChange={(e) => setMyData(prevState => ({
               ...prevState,
               Surename: e.target.value 
           }))}
              id="surname" name="surname"  />
              <label htmlFor="dob">Date of Birth:</label>
              <input type="date" 
              value={myData?.dob || ''} 
              onChange={(e) => setMyData(prevState => ({
                 ...prevState,
                 dob: e.target.value 
             }))}
              id="dob" name="dob"  />
              <label htmlFor="gender">Gender:</label>
              <select id="gender" name="gender"
              value={myData?.gender || ''} 
              onChange={(e) => setMyData(prevState => ({
                 ...prevState,
                 gender: e.target.value 
             }))}
              > <option value="" disabled>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label htmlFor="phone">Phone Number:</label>
              <input type="text" id="phone" name="phone" value={myData?.Phone || ''} 
                                 onChange={(e) => setMyData(prevState => ({
                                    ...prevState,
                                    Phone: e.target.value 
                                }))}  />
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" value={myData?.email || ''} 
                                onChange={(e) => setMyData(prevState => ({
                                    ...prevState,
                                    email: e.target.value 
                                }))} />
            </div>
            <button id="saveButton" className='hkjsaveButton' onClick={savePersonalInfo}>Save</button>
          </section>
  

  {/* Appioment List */}
  <section id="appointments" class="main special">
    <div class="container">
        <header class="major">
            <h2 className='wallcokffgft'>Appointments</h2>
            <p>Appointments made by patients</p>
        </header>
        <div class="scrollable-table">
          {allappointment?
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Name</th>
                        <th>Reason</th>
                        <th>Additional Infos</th>
                        <th>Doctor</th>
                        <th>State</th>
                    </tr>
                </thead>
                <tbody>
                    
                   {
                    allappointment?.map((row, indexe)=>{
                      return(
                    <tr>
                        <td>{row.date}</td>
                        <td>{row.time}</td>
                        <td>{row.patientName}</td>
                        <td>{row.reason}</td>
                        <td>{row.note}</td>
                        <td class="doctor-cell">
                          <select value={row.doctorID || ''} 
                           onChange={e=> handleChange(indexe, 'doctorID', e.target.value)}>
                            <option value="" disabled>Select Doctor</option>
                            {
                            Alldoctor?.map((item, index)=>{
                              return(
                               <option value={item.id} key={index}>{item.Surename}</option>
                              )
                            })
                              
                            }
                        
                        </select></td>
                        <td>
                        {row.status==="Pending"?
                        <div style={{display:'flex', flexDirection: 'column', gap: '12px'}}>
                        <button onClick={e=>handelApproveappionmeient(row)} class="accept-hkj-button">Accept</button>
                        <button onClick={e=>handelCancelappionmeient(row)} class="accept-hkj-button" >Refuse</button>
                        </div>:
                        row.status==="Approve"?"Refused":"accepted"
                          }
                        </td>
                    </tr>
                    )})
                    }
					
						
					
			
                    
                </tbody>
            </table>:
            <div>No Data Found</div>
                          }
        </div>
    </div>
</section> 
  
         



<section id="payment" class="main special">
    <header class="major">
        <h2 className='wallcokffgft'>Payment</h2>
        <p>Here is the payment check for the patients</p>
    </header>
    <div class="scrollable-table">
    {AllPatients?
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Date of Birth</th>
                    <th>Status</th>
                    <th>Amount ($)</th>
                    <th>Method</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="payment-body">
              {AllPatients?.map((item, index)=>{
           return(
            <tr key={index}>
             <td>{item.Surename}</td>
             <td>{item.dob}</td>
             <td><select 
             value={item.statuse || ''}
             onChange={e=> handleamountstatusChange(index, 'statuse', e.target.value)}
             name="" id="" className='status-dropdown'>
              <option value="" disabled>Select</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Canceled">Canceled</option>
              </select></td>
              <td><input value={item.amount || ''} style={{height: "30px"}}
             onChange={e=> handleamountstatusChange(index, 'amount', e.target.value)} type="text" /></td>
              <td><select value={item.method || ''}
             onChange={e=> handleamountstatusChange(index, 'method', e.target.value)} name="" id="">
              <option value="" disabled>Select</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="NFC">NFC</option>
              </select></td>

              <td><button className='accept-hkj-button' onClick={e=>handelpaymentsave(item)}>Save</button></td>

            </tr>
           )

              })}
            </tbody>
        </table>:
"No Data Here"
    }
    </div>
</section>




        </div>
  
        <footer id="patient_footer">
          <section>
            <h2>Rodoil Hospital</h2>
            <p>Rodoil Hospital, with 25 years of commitment, offers exceptional medical care and personalized attention. Our skilled professionals prioritize high-quality care, utilizing advanced technology and innovative treatments to enhance the health and well-being of our patients.</p>
            <div className="icon">
              <img src="images/Rodoil-logo.png" alt="site logo" style={{ width: "200px", height: "auto" }} />
            </div>
          </section>
          <section>
            <h2>General</h2>
            <dl className="altKKstya">
              <dt>Address</dt>
              <dd>Emniyet Evleri, Bitki Sk.Kâğıthane/Istanbul Turkey</dd>
              <dt>Phone</dt>
              <dd>+90 000 000 00 00</dd>
              <dt>Email</dt>
              <dd><Link to="mailto:infos@rodoil.com">infos@rodoil.com</Link></dd>
          </dl>
          <ul className="hkkjjjticons">
            <li><Link to="https://twitter.com/" target="_blank" className="icon brands fa-twitter alt"><span className="label">Twitter</span></Link></li>
            <li><Link to="https://www.facebook.com/" target="_blank" className="icon brands fa-facebook-f alt"><span className="label">Facebook</span></Link></li>
            <li><Link to="https://www.instagram.com/" target="_blank" className="icon brands fa-instagram alt"><span className="label">Instagram</span></Link></li>
            <li><Link to="https://github.com/iliassderouich" target="_blank" className="icon brands fa-github alt"><span className="label">GitHub</span></Link></li>
            <li><Link to="https://www.linkedin.com/" target="_blank" className="icon brands fa-linkedin-in alt"><span className="label">LinkedIn</span></Link></li>
          </ul>
        </section>
        <p className="copyright">&copy; <Link>Rodoil Hospital</Link></p>
      </footer>
      <ToastContainer/>
    </div>
</div>
        
    );
};

export default DashboardReceptionist;