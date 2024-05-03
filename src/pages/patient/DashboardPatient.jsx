import React, { useEffect, useState } from 'react';
import '../../components/Css/PatientDashboard.css';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { onValue, ref, update } from 'firebase/database';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link as ScrollLink } from 'react-scroll';

const DashboardPatient = () => {
    const navigate = useNavigate();
    const [userID, setUserID]=useState();
    const [patientData, setPatientData]=useState();
    const [reason, setReason] = useState('');
    const [preferredDate, setPreferredDate]=useState('');
    const [preferredTime, setPreferredTime]=useState('');
    const [information, setInformation]=useState('');
    const [myappointment, setMyappointment]=useState();
    const [notifyCount, setNotifyCount]=useState(0);
    const [notifyShow, setNotifyShow]=useState(false);


    useEffect(()=>{
        onAuthStateChanged(auth, user => {
            if (user) {
            ////User info
              setUserID(user.uid);
              onValue(ref(db, `User/${user.uid}`), snapshot => {
                if (snapshot.exists()) {
                    if(snapshot.val().Role==="patient"){
                        const myData = snapshot.val();
                        setPatientData(myData);
                        if(myData?.Notify){
                  const trueStatusCount = Object.values(myData?.Notify).filter(item => item.status).length;
                         setNotifyCount(trueStatusCount);
                        }
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
              const filtermyAppointment = records?.filter(item=> item.patientID===user.uid);
              setMyappointment(filtermyAppointment);
            }
          });
        
            }
            else{
                navigate('/patient-auth');
            }
          });
    },[navigate]);

    /////Logout
    const handelLogout=()=>{
        signOut(auth).then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });

    };
    


   
   ////Sva info
    const savePersonalInfo =async () => {
        const currentDate = new Date();
        const selectedDate = new Date(patientData?.dob);
    
        if (selectedDate > currentDate) {
            alert("Date of birth cannot be in the future. Please select a valid date.");
            return;
        }
    
        try{
            await update(ref(db, `User/${userID}`), patientData)
        toast("Update Sucess"); 
        }
        catch{
            toast("Try again");
        }
    };
    
    ////Handel app
    const handelAppointment =async (event) => {
        event.preventDefault();
        try{
            const ms = Date.now();
            await update(ref(db, `Appointment/${ms}`), {
                id: ms,
                patientID: userID,
                patientName: patientData.Surename,
                reason: reason,
                date: preferredDate,
                time: preferredTime,
                note: information,
                status: "Pending"
            })
        toast("appointment Sucess"); 
        setReason("");
        setInformation("");
        setPatientData("");
        setPreferredTime("");
        }
        catch{
            toast("Try again");
        }
    };
    
    
    const handelnotifymarksee =async ()=>{
      setNotifyShow(!notifyShow);
      const data = patientData?.Notify;
      for (const key in data) {
        if (data[key].status === true) {
          await update(ref(db, `User/${userID}/Notify/${key}`), {
            status: false
          });
        }}
        
    };

    return (
<div style={{background: "black"}}>
        <div id="wrapper">
        <nav id="nav">
          <ul>
            <li>
            <ScrollLink to="welcome" spy={true} smooth={true} offset={-30}duration={500}>
              <Link to="#welcome" className="active">Welcome</Link>
              </ScrollLink>
              </li>
            <li><ScrollLink to="profile" spy={true} smooth={true} offset={-30}duration={500}>
              <Link to="#profile">Personal information</Link></ScrollLink>
              </li>
            <li><ScrollLink to="appointment" spy={true} smooth={true} offset={-30}duration={500}>
              <Link to="#appointment">Appointment</Link></ScrollLink>
              </li>
            <li><ScrollLink to="records" spy={true} smooth={true} offset={-30}duration={500}>
              <Link to="#records">Medical records</Link> </ScrollLink></li>
            <li>
              <div style={{display:'flex', position: 'relative', gap: "15px"}}> 

      
              {notifyCount>0 ?
      <Badge badgeContent={notifyCount} color="success" onClick={handelnotifymarksee}>
        <NotificationsIcon color="action" />
      </Badge>:<NotificationsIcon onClick={e=>setNotifyShow(!notifyShow)} color="action" />}

{notifyShow&&
      <div className='notifycontents'>
  {patientData?.Notify?
    Object.values(patientData?.Notify)?.map((item, index)=>{
      return(
        <p key={index}>{item.message}</p>
      )
    }):
    "Empty Notification"}
     
      </div>}

      <LogoutIcon onClick={handelLogout}/>

            </div></li>
          </ul>
        </nav>
  
        <div id="main">
          <section id="welcome" className="main">
            <div className="spotlight">
              <div className="content">
                <header className="major">
                  <div className="icon">
                    <img src={"images/Rodoil-logo.png"} alt="site logo" style={{ width: "200px", height: "auto" }} />
                    <h2>Welcome back</h2>
                  </div>
                </header>
                <p>"Health is the greatest possession. Contentment is the greatest treasure. Confidence is the greatest friend. - Lao Tzu"</p>
                <ul className="actions"  style={{marginTop: '50px'}}>
                  <li><ScrollLink to="appointment" spy={true} smooth={true} offset={-30}duration={500}>
                    <Link to="#appointment" className="hkj3saveButton">Schedule an appointment</Link>
                    </ScrollLink></li>
                </ul>
              </div>
              <span className="image"><img src={patientData?.avater ? patientData?.avater : "images/user.png"} alt="" /></span>
            </div>
          </section>
  
          <section id="profile" className="main special">
            <header className="major">
              <h2 className='wallcokffgft'>Personal information</h2>
            </header>
            <div id="personalInfo">
              <label htmlFor="name">Username:</label>
              <input type="text" 
              value={patientData?.Username || ''} 
              onChange={(e) => setPatientData(prevState => ({
               ...prevState,
               Username: e.target.value 
           }))} id="name" name="name"  />
              <label htmlFor="surname">Surname:</label>
              <input type="text" 
              value={patientData?.Surename || ''} 
              onChange={(e) => setPatientData(prevState => ({
               ...prevState,
               Surename: e.target.value 
           }))}
              id="surname" name="surname"  />
              <label htmlFor="dob">Date of Birth:</label>
              <input type="date" 
              value={patientData?.dob || ''} 
              onChange={(e) => setPatientData(prevState => ({
                 ...prevState,
                 dob: e.target.value 
             }))}
              id="dob" name="dob"  />
              <label htmlFor="gender">Gender:</label>
              <select id="gender" name="gender"
              value={patientData?.gender || ''} 
              onChange={(e) => setPatientData(prevState => ({
                 ...prevState,
                 gender: e.target.value 
             }))}
              > <option value="" disabled>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label htmlFor="phone">Phone Number:</label>
              <input type="text" id="phone" name="phone" value={patientData?.Phone || ''} 
                                 onChange={(e) => setPatientData(prevState => ({
                                    ...prevState,
                                    Phone: e.target.value 
                                }))}  />
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" value={patientData?.email || ''} 
                                onChange={(e) => setPatientData(prevState => ({
                                    ...prevState,
                                    email: e.target.value 
                                }))} />
              <label htmlFor="bloodType">Blood Type:</label>
              <select id="bloodType" name="bloodType" value={patientData?.bloodType || ''} 
                                 onChange={(e) => setPatientData(prevState => ({
                                    ...prevState,
                                    bloodType: e.target.value 
                                }))}>
                <option value="" disabled>Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <button id="saveButton" className='hkjsaveButton' onClick={savePersonalInfo}>Save</button>
          </section>
  
          <section id="appointment" className="main special">
            <header className="major">
              <h2 className='wallcokffgft'>Appointment</h2>
              <p>Please fill this form!</p>
            </header>
            <form id="appointmentForm" onSubmit={handelAppointment}>
              <label htmlFor="reason">Reason for visit:</label>
              <textarea id="reason" name="reason" rows="4" 
              value={reason} onChange={e=>setReason(e.target.value)} required></textarea>
              <label htmlFor="date">Preferred Date:</label>
              <input type="date" id="date" name="date"
              value={preferredDate} onChange={e=>setPreferredDate(e.target.value)} required />
              <label htmlFor="time">Preferred Time:</label>
              <input type="time" id="time" name="time"
              value={preferredTime} onChange={e=>setPreferredTime(e.target.value)} required />
              <label htmlFor="additionalInfo">Additional Information:</label>
              <textarea id="additionalInfo" name="additionalInfo" 
              value={information} onChange={e=>setInformation(e.target.value)} rows="4"></textarea> <br />
              <button type="submit" className='hkj2saveButton'>Submit Appointment</button>
            </form>
          </section>
  
          <section id="records" className="main special">
            <header className="major">
              <h2 className='wallcokffgft'>Medical records</h2>
              <p>Here are your medical records</p>
            </header>
            {myappointment ?
            <table>
              <thead>
       
                <tr>
                  <th className="head">Date</th>
                  <th className="head">Doctor</th>
                  <th className="description">Description</th>
                </tr>
              </thead>
              <tbody>
               {myappointment?.map((item, index)=>{
                return(
<tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.doctorName?item.doctorName:"Not set"}</td>
                  <td>{item.prescription?item.prescription:"Not set"}</td>
                </tr>

                )
               })
                }
               
              </tbody>
            </table>:
            
            <div>No Data Here</div>
            }
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

export default DashboardPatient;