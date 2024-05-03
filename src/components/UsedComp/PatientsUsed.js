import React from 'react';
import { PatientTable } from '../Tables';
import { useNavigate } from 'react-router-dom';

function PatientsUsed({data}) {
  console.log(data)
  const navigate = useNavigate();
  // preview
  const preview = (id) => {
    navigate(`/patients/preview/${id}`);
  };
  return (
    <div className="w-full">
      <h1 className="text-sm font-medium mb-6">Patients</h1>
      <div className="w-full overflow-x-scroll">
        <PatientTable
          used={true}
          data={data}
          functions={{
            preview: preview,
          }}
        />
      </div>
    </div>
  );
}

export default PatientsUsed;
