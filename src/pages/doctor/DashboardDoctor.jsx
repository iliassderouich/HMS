import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { onValue, ref, update } from 'firebase/database';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAlluserData } from '../../Database';
import { Link as ScrollLink } from 'react-scroll';

const DashboardDoctor = () => {
    const navigate = useNavigate();
    const [userID, setUserID]=useState();
    const [doctorsData, setDoctorsData]=useState();
    const [myappointment, setMyappointment]=useState();
    const [notifyCount, setNotifyCount]=useState(0);
    const [notifyShow, setNotifyShow]=useState(false);

    const alluserData = useAlluserData();
    const AllPatient = alluserData?.filter(member => member.Role === "patient").sort((a, b) => b.ms - a.ms);
    


    useEffect(()=>{
        onAuthStateChanged(auth, user => {
            if (user) {
            ////User info
              setUserID(user.uid);
              onValue(ref(db, `User/${user.uid}`), snapshot => {
                if (snapshot.exists()) {
                    if(snapshot.val().Role==="doctor"){
                        const myData = snapshot.val();
                        setDoctorsData(myData);
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
              const filtermyAppointment = records?.filter(item=> item.doctorID===user.uid);
              setMyappointment(filtermyAppointment);
            }
          });
        
            }
            else{
                navigate('/doctor-auth');
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
        const selectedDate = new Date(doctorsData?.dob);
    
        if (selectedDate > currentDate) {
            alert("Date of birth cannot be in the future. Please select a valid date.");
            return;
        }
    
        try{
            await update(ref(db, `User/${userID}`), doctorsData)
        toast("Update Sucess"); 
        }
        catch{
            toast("Try again");
        }
    };
    
  
    

    //////Prescription
    const handelprescription = (item, value) => {
      update(ref(db, `Appointment/${item.id}`), {
        prescription: value
      }).then(() => {
        console.log("Prescription updated successfully.");
      }).catch((error) => {
        console.error("Error updating prescription:", error);
      });
    };
    
    
    const handelnotifymarksee =async ()=>{
      setNotifyShow(!notifyShow);
      const data = doctorsData?.Notify;
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
          <li><ScrollLink to="welcome" spy={true} smooth={true} offset={-30}duration={500}>
            <Link to="#welcome" class="active">Welcome</Link></ScrollLink></li>
			<li><ScrollLink to="profile" spy={true} smooth={true} offset={-30}duration={500}>
        <Link to="#profile">Personal informations</Link></ScrollLink></li>
			<li><ScrollLink to="patientslist" spy={true} smooth={true} offset={-30}duration={500}>
        <Link to="#patientslist">List of patients</Link></ScrollLink></li>
			<li><ScrollLink to="affapp" spy={true} smooth={true} offset={-30}duration={500}>
        <Link to="#affapp">Affected Appointments</Link> </ScrollLink></li>
            <li>
              <div style={{display:'flex', position: 'relative', gap: "15px"}}> 

      
              {notifyCount>0 ?
      <Badge badgeContent={notifyCount} color="success" onClick={handelnotifymarksee}>
        <NotificationsIcon color="action" />
      </Badge>:<NotificationsIcon onClick={e=>setNotifyShow(!notifyShow)} color="action" />}

{notifyShow&&
      <div className='notifycontents'>
  {doctorsData?.Notify?
    Object.values(doctorsData?.Notify)?.map((item, index)=>{
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


        <section id="welcome" class="main">
			<div class="spotlight">
			<div class="content">
			<header class="major">
		<div class = "icon">
	<img src={"images/Rodoil-logo.png"} alt="site logo" style={{ width: "200px", height: "auto" }}/>
	<h2>Welcome Doctor!</h2></div>
	</header>
	<p>“The awe of discovering the human body. The honor of being trusted to give advice. The gratitude for helping someone through a difficult illness. These things never grow old.” Danielle Ofri</p>
		<ul class="actions"  style={{marginTop: '50px'}}>
											<li><Link to="#patientslist" className="hkj3saveButton">My patients</Link></li>
										</ul>
									</div>
									<span class="image"><img src={doctorsData?.avater ? doctorsData?.avater :"images/user.png"} alt="" /></span>
								</div>
							</section>
    
  
          <section id="profile" className="main special">
            <header className="major">
              <h2>Personal information</h2>
            </header>
            <div id="personalInfo">
              <label htmlFor="name">Username:</label>
              <input type="text" 
              value={doctorsData?.Username || ''} 
              onChange={(e) => setDoctorsData(prevState => ({
               ...prevState,
               Username: e.target.value 
           }))} id="name" name="name"  />
              <label htmlFor="surname">Surname:</label>
              <input type="text" 
              value={doctorsData?.Surename || ''} 
              onChange={(e) => setDoctorsData(prevState => ({
               ...prevState,
               Surename: e.target.value 
           }))}
              id="surname" name="surname"  />
              <label htmlFor="dob">Date of Birth:</label>
              <input type="date" 
              value={doctorsData?.dob || ''} 
              onChange={(e) => setDoctorsData(prevState => ({
                 ...prevState,
                 dob: e.target.value 
             }))}
              id="dob" name="dob"  />
              <label htmlFor="gender">Gender:</label>
              <select id="gender" name="gender"
              value={doctorsData?.gender || ''} 
              onChange={(e) => setDoctorsData(prevState => ({
                 ...prevState,
                 gender: e.target.value 
             }))}
              > <option value="" disabled>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label htmlFor="phone">Phone Number:</label>
              <input type="text" id="phone" name="phone" value={doctorsData?.Phone || ''} 
                                 onChange={(e) => setDoctorsData(prevState => ({
                                    ...prevState,
                                    Phone: e.target.value 
                                }))}  />
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" value={doctorsData?.email || ''} 
                                onChange={(e) => setDoctorsData(prevState => ({
                                    ...prevState,
                                    email: e.target.value 
                                }))} />
              
            </div>
            <button id="saveButton" className="hkjsaveButton" onClick={savePersonalInfo}>Save</button>
          </section>
  
  {/* All patient list */}
          <section id="patientslist" class="main special">
								<header class="major">
									<h2>List of patients</h2>
									<p>This is your list of patients</p>
								</header>

								<div class="scrollable-table">
                {AllPatient?
									<table>
										<thead>
											<tr>
												<th>Name</th>
												<th>Date of Birth</th>
												<th>Gender</th>
												<th>Phone Number</th>
												<th>Email</th>
												<th>Blood Type</th>
											</tr>
										</thead>
										<tbody>
									
										{AllPatient?.map((item, index)=>{

                      return(
                        <tr key={index}>
												<td>{item.Surename}</td>
												<td>{item.dob}</td>
												<td>{item.gender}</td>
												<td>{item.Phone}</td>
												<td>{item.email}</td>
												<td>{item.bloodType}</td>
											</tr>
                      )
                    })	}


                                           
										</tbody>
									</table>:
"No Patient Data"
                }
								</div>
                                
                                </section>









  
              <section id="affapp" class="main special">
								<header class="major">
									<h2>Affected Appointments</h2>
									<p>Here is your Affected Appointments</p>
								</header>
                {myappointment ?

              
								<table>
									<thead>
										<tr>
											<th class="head">Date</th>
											<th class="head">Patient</th>
											<th class="description">Description</th>
										</tr>
									</thead>
									<tbody>
                  {myappointment.map((item, index)=>{
                  return(
										<tr key={index}>
											<td>{item.date}</td>
											<td>{item.patientName}</td>
											<td class="editable">
                      
                    <input type="text" className='inpututypreaaac_write'
                    value={item.prescription?item.prescription:""}
                    onChange={e=>handelprescription(item, e.target.value)}
                    />  
                    </td>
										</tr>
                    )
                  })}

                    </tbody>
								</table>  : "no appointment"}
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
    </div></div>

        
    );
};

export default DashboardDoctor;