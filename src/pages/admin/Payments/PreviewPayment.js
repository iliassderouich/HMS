import React, { useEffect, useState } from 'react';
import Layout from '../../../Layout';
import { toast } from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import ShareModal from '../../../components/Modals/ShareModal';
import { RiShareBoxLine } from 'react-icons/ri';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { AiOutlinePrinter } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import SenderReceverComp from '../../../components/SenderReceverComp';
import { onValue, ref } from 'firebase/database';
import { db } from '../../../firebase';

function PreviewPayment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [payment, setPayment] = useState();
  const buttonClass =
    'bg-subMain flex-rows gap-3 bg-opacity-5 text-subMain rounded-lg border border-subMain border-dashed px-4 py-3 text-sm';


    useEffect(()=>{
onValue(ref(db, `Payment/${id}`), snapshot=>{
if(snapshot.exists()){
setPayment(snapshot.val());
console.log(snapshot.val());
}
else{
navigate('/admin');
}

});
    },[id, navigate])
  return (
    <Layout>
      {isShareOpen && (
        <ShareModal
          isOpen={isShareOpen}
          closeModal={() => {
            setIsShareOpen(false);
          }}
        />
      )}
      <div className="flex-btn flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/payments"
            className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
          >
            <IoArrowBackOutline />
          </Link>
          <h1 className="text-xl font-semibold">Preview Payment</h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* button */}
          <button
            onClick={() => {
              setIsShareOpen(true);
            }}
            className={buttonClass}
          >
            Share <RiShareBoxLine />
          </button>
          <button
            onClick={() => {
              toast.error('This feature is not available yet');
            }}
            className={buttonClass}
          >
            Download <MdOutlineCloudDownload />
          </button>
          <button
            onClick={() => {
              toast.error('This feature is not available yet');
            }}
            className={buttonClass}
          >
            Print <AiOutlinePrinter />
          </button>
          <Link to={`/payments/edit/` + payment?.id} className={buttonClass}>
            Edit <FiEdit />
          </Link>
        </div>
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        {/* header */}
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2 items-center">
          <div className="lg:col-span-3 flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="logo"
              className=" w-32 object-contain"
            />
            <span
              className={`text-xs px-4
              ${
                payment?.status === 'Paid'
                  ? 'bg-subMain text-subMain border-subMain'
                  : payment?.status === 'Pending'
                  ? 'bg-orange-500 text-orange-500 border-orange-500'
                  : payment?.status === 'Canceled' &&
                    'bg-red-600 text-red-600 border-red-600'
              }
               py-1 border bg-opacity-10 border-opacity-40 rounded-full`}
            >
              {payment?.status}
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:items-end">
            <h6 className="text-xs font-medium">#{payment?.id}</h6>
            <div className="flex gap-4">
              <p className="text-sm font-extralight">Date:</p>
              <h6 className="text-xs font-medium">{payment?.Month}/{payment?.Day}/{payment?.Year}</h6>
            </div>
          </div>
        </div>
        {/* sender and recever */}
        <SenderReceverComp item={payment} functions={{}} button={false} />
        {/* products */}
        <div className="grid grid-cols-6 gap-6 mt-8 items-start">
          <div className=" col-span-6 flex flex-col gap-6">
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Paid By:</p>
              <h6 className="text-sm font-medium">{payment?.method}</h6>
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Currency:</p>
              <h6 className="text-sm font-medium">USD ($)</h6>
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Sub Total:</p>
              <h6 className="text-sm font-medium">${payment?.amount}</h6>
            </div>
          
          
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Grand Total:</p>
              <h6 className="text-sm font-medium text-green-600">${payment?.amount}</h6>
            </div>
            {/* notes */}
            <div className="w-full p-4 border border-border rounded-lg">
              <h1 className="text-sm font-medium">Notes</h1>
              <p className="text-xs mt-2 font-light leading-5">
                Thank you for your business. We hope to work with you again
                soon. You can pay your invoice online at
                www.example.com/payments
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PreviewPayment;
