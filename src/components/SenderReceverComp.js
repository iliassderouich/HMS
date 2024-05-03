import React from 'react';
import { BiPlus } from 'react-icons/bi';

function SenderReceverComp({ item, functions, button }) {
  return (
    <div className="grid sm:grid-cols-2 gap-6 items-center mt-4">
      <div className="border border-border rounded-xl p-5">
        <div className="flex-btn gap-4">
          <h1 className="text-md font-semibold">From:</h1>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <h6 className="text-xs font-medium">{item?.receptionistName}</h6>
          <p className="text-xs text-textGray">{item?.receptionistID}</p>
          <p className="text-xs text-textGray">{item?.receptionistPhone}</p>
        </div>
      </div>
      <div className="border border-border rounded-xl p-5">
        <div className="flex-btn gap-4">
          <h1 className="text-md font-semibold">To:</h1>
          {button && (
            <button
              onClick={() => functions.openModal()}
              className="bg-dry text-subMain flex-rows gap-2 rounded-lg border border-border py-2 px-4 text-sm"
            >
              <BiPlus /> Add
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <h6 className="text-xs font-medium">{item?.patientName}</h6>
          <p className="text-xs text-textGray">{item?.patientID}</p>
          <p className="text-xs text-textGray">{item?.patientPhone}</p>
        </div>
      </div>
    </div>
  );
}

export default SenderReceverComp;
