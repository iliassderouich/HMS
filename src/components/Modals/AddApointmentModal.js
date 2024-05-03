import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import {
  Button,
  DatePickerComp,
  Select,
  Textarea,
  TimePickerComp,
} from '../Form';
import { BiChevronDown } from 'react-icons/bi';
import { sortsDatas } from '../Datas';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import PatientMedicineServiceModal from './PatientMedicineServiceModal';
import { update, ref } from 'firebase/database';
import { db } from '../../firebase';



function AddAppointmentModal({ closeModal, isOpen, doctorlis, datas }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [status, setStatus] = useState(sortsDatas.status[0]);
  const [doctors, setDoctors] = useState('');
  const [open, setOpen] = useState(false);

   const doctorsData = doctorlis?.map((item) => {
    return {
      id: item.id,
      name: item.Surename,
    };
  });


  // set data
  useEffect(() => {
    if (datas?.title) {
      setEndTime(datas?.end);
    }
  }, [datas]);


  const handelsaveITEm=()=>{
  if(doctors.name){
    const formetstartDate = `${startDate.getDate()}-${startDate.getMonth() + 1}-${startDate.getFullYear()}`
    const formetendTime = endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
console.log(datas.id, status, formetendTime, formetendTime)
update(ref(db, `Appointment/${datas.id}`), {
  doctorName: doctors.name,
  doctorID: doctors.id,
  time: formetendTime,
  date: formetstartDate,
  status: status.name

});
toast('Update Sucess');
  }
  else{
    toast('Fill all info');
  }
  };

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={'Edit Appointment'}
      width={'max-w-3xl'}
    >
      {open && (
        <PatientMedicineServiceModal
          closeModal={() => setOpen(!isOpen)}
          isOpen={open}
          patient={true}
        />
      )}
      <div className="flex-colo gap-6">
        <div className="grid sm:grid-cols-12 gap-4 w-full items-center">
          <div className="sm:col-span-10">
          <h2> {datas?.patientName}</h2>
          </div>

        </div>

       

        <div className="grid sm:grid-cols-2 gap-4 w-full">
        <DatePickerComp
            label="Date of visit"
            startDate={startDate}
            onChange={(date) => setStartDate(date)}
          />
          <TimePickerComp
            label="End time"
            startDate={endTime}
            onChange={(date) => setEndTime(date)}
          />
        </div>

        {/* status && doctor */}
        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Doctor</p>
            <Select
              selectedPerson={doctors}
              setSelectedPerson={setDoctors}
              datas={doctorsData}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {doctors?.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Status</p>
            <Select
              selectedPerson={status}
              setSelectedPerson={setStatus}
              datas={sortsDatas.status}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {status.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
        </div>

        {/* des */}
        <Textarea
          label="Reson"
          placeholder={
            datas?.reason
              ? datas.reason
              : 'She will be coming for a checkup.....'
          }
          disabled={true}
          color={true}
          rows={5}
        />

       
        {/* buttones */}
        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={closeModal}
            className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
          >
            {datas?.title ? 'Discard' : 'Cancel'}
          </button>
          <Button
            label="Save"
            Icon={HiOutlineCheckCircle}
            onClick={ handelsaveITEm}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddAppointmentModal;
