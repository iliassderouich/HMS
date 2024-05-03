import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Aos from 'aos';
import Login from './pages/admin/Login';
import LoginRegister from './pages/patient/LoginRegister';
import LoginReceptionist from './pages/receptionist/LoginReceptionist';
import LoginDoctor from './pages/doctor/LoginDoctor';
import Dashboard from './pages/admin/Dashboard';
import DashboardPatient from './pages/patient/DashboardPatient';
import DashboardReceptionist from './pages/receptionist/DashboardReceptionist';
import DashboardDoctor from './pages/doctor/DashboardDoctor';
import Patients from './pages/admin/Patients/Patients';
import PatientProfile from './pages/admin/Patients/PatientProfile';
import CreatePatient from './pages/admin/Patients/CreatePatient';
import NewMedicalRecode from './pages/admin/Patients/NewMedicalRecode';
import Doctors from './pages/admin/Doctors/Doctors';
import DoctorProfile from './pages/admin/Doctors/DoctorProfile';
import Receptions from './pages/admin/Receptions';
import Appointments from './pages/admin/Appointments';
import NotFound from './pages/admin/NotFound';
import Toast from './components/Notifications/Toast';
import Home from './pages/home/Home';
import EditPayment from './pages/admin/Payments/EditPayment';
import PreviewPayment from './pages/admin/Payments/PreviewPayment';
import Payments from './pages/admin/Payments/Payments';
import Settings from './pages/admin/Settings';


function App() {
  Aos.init();

  return (
    <>
      {/* Toaster */}
      <Toast />
      {/* Routes */}
      <BrowserRouter>
        <Routes>
        <Route path='/'  element={<Home/>}  />

        {/* Login */}
        <Route path="/login" element={<Login />} />
      <Route path='/patient-auth'  element={<LoginRegister/>}  />
      <Route path='/receptionist-auth'  element={<LoginReceptionist/>}  />
      <Route path='/doctor-auth'  element={<LoginDoctor/>}  />

          {/* Dashbords */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/patient" element={<DashboardPatient />} />
          <Route path="/receptionist" element={<DashboardReceptionist />} />
          <Route path="/doctor" element={<DashboardDoctor />} />
          
          {/* payments */}
          <Route path="/payments" element={<Payments />} />
          <Route path="/payments/edit/:id" element={<EditPayment />} />
          <Route path="/payments/preview/:id" element={<PreviewPayment />} />
          {/* patient */}
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/preview/:id" element={<PatientProfile />} />
          <Route path="/patients/create" element={<CreatePatient />} />
          <Route path="/patients/visiting/:id" element={<NewMedicalRecode />} />
          {/* doctors */}
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/preview/:id" element={<DoctorProfile />} />
          {/* reception */}
          <Route path="/receptions" element={<Receptions />} />
          {/* others */}
          
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
