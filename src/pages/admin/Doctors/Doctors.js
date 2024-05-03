import React, { useState } from 'react';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { BiPlus } from 'react-icons/bi';
import Layout from '../../../Layout';
import { Button } from '../../../components/Form';
import { DoctorsTable } from '../../../components/Tables';
import { useNavigate } from 'react-router-dom';
import AddDoctorModal from '../../../components/Modals/AddDoctorModal';
import { useAlluserData } from '../../../Database';
import { ref, remove } from 'firebase/database';
import { db } from '../../../firebase';

function Doctors() {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const alluserData = useAlluserData();
  const [searchreceptionists, setSearchreceptionists]=useState('');
  const Alldoctor = alluserData?.filter(member => member.Role === "doctor" &&
                      member.Surename?.toLowerCase().includes(searchreceptionists.toLowerCase()))
                      .sort((a, b) => b.ms - a.ms);

  const onCloseModal = () => {
    setIsOpen(false);
  };

  const preview = (data) => {
    navigate(`/doctors/preview/${data.id}`);
  };
  ///Delete item
const handeldeleteitem=async(id)=>{
  try{
remove(ref(db, `User/${id}`));
toast("Delete Account Sucess")
}
catch(err){
  toast("Try to next time");
}
};

  return (
    <Layout>
      {
        // add doctor modal
        isOpen && (
          <AddDoctorModal
            closeModal={onCloseModal}
            isOpen={isOpen}
            doctor={true}
            datas={null}
          />
        )
      }
      {/* add button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-hkj-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>
      {/*  */}
      <h1 className="text-xl font-semibold">Doctors</h1>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        {/* datas */}

        <div className="grid md:grid-cols-6 sm:grid-cols-2 grid-cols-1 gap-2">
          <div className="md:col-span-5 grid lg:grid-cols-4 items-center gap-6">
            <input
            value={searchreceptionists}
            onChange={e=>setSearchreceptionists(e.target.value)}
              type="text"
              placeholder='Search "daudi mburuge"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
            />
          </div>

          {/* export */}
          <Button
            label="Export"
            Icon={MdOutlineCloudDownload}
            onClick={() => {
              toast.error('Exporting is not available yet');
            }}
          />
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <DoctorsTable
            doctor={true}
            data={Alldoctor}
            functions={{
              preview: preview,
            }}
            deleteitem={{
              previewr: handeldeleteitem,
            }}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Doctors;
