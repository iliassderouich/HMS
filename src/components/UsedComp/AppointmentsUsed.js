import { useState } from 'react';
import AddAppointmentModal from '../Modals/AddApointmentModal';
import { AppointmentTable } from '../Tables';

function AppointmentsUsed({doctorData, Appointmentdata, doctor }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});

  // onClick event handler
  const handleEventClick = (event) => {
    setData(event);
    setOpen(!open);
  };
  // handle modal close
  const handleClose = () => {
    setOpen(!open);
    setData({});
  };
  return (
    <div className="w-full">
      {open && (
        <AddAppointmentModal
          doctorlis={doctorData}
          datas={data}
          isOpen={open}
          closeModal={() => {
            handleClose();
          }}
        />
      )}
      <h1 className="text-sm font-medium mb-6">Appointments</h1>

      {Appointmentdata?
      <div className="w-full overflow-x-scroll">
        <AppointmentTable
          data={Appointmentdata}
          doctor={doctor}
          functions={{
            preview: handleEventClick,
          }}
        />
      </div>:
      "No Data found"
      }
    </div>
  );
}

export default AppointmentsUsed;
