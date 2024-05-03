import React from 'react';
import { toast } from 'react-hot-toast';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { db } from './../../../firebase';
import { ref, remove } from 'firebase/database';

function MedicalRecord({data}) {

  const handelRemoveRecord=(id)=>{
    remove(ref(db, `Appointment/${id}`))
    .then(() => {
      toast("Item removed successfully.");
    })
    .catch((error) => {
      console.error("Error removing item: ", error.message);
    });
  };
  

  return (
      <div className="flex flex-col gap-6" >
        <div className="flex-btn gap-4" >
          <h1 className="text-sm font-medium sm:block hidden" >
            Medical Record
          </h1>
       
        </div>
        {data?.map((data) => (
          <div
            key={data.id}
            style={{width: '100%'}}
            className="bg-dry items-start grid grid-cols-12 gap-4 rounded-xl border-[1px] border-border p-6"
          >
            <div className="col-span-12 md:col-span-2">
              <p className="text-xs text-textGray font-medium">{data.date}</p>
            </div>
            <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
            
                <p className="text-xs text-main font-light">
                  <span className="font-medium">{data.prescription?data.prescription:"Not set"}:</span>{' '}
                 
                </p>
            
            </div>
            {/* price */}
            <div className="col-span-12 md:col-span-2">
              <p className="text-xs text-subMain font-semibold">
                <span className="font-light text-main">Doctor: </span>{' '}
                {data.doctorName?data.doctorName:"Not set"}
              </p>
            </div>
            {/* actions */}
            <div className="col-span-12 md:col-span-2 flex-rows gap-2">
        
              <button
                onClick={() => handelRemoveRecord(data.id)}
                className="text-sm flex-colo bg-white text-red-600 border border-border rounded-md w-2/4 md:w-10 h-10"
              >
                <RiDeleteBin6Line />
              </button>
            </div>
          </div>
        ))}
      </div>
  );
}

export default MedicalRecord;
