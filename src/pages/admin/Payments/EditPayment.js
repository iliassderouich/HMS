import React, { useEffect, useState } from 'react';
import Layout from '../../../Layout';
import { toast } from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import { Button, Select, Textarea } from '../../../components/Form';
import { BsSend } from 'react-icons/bs';
import {sortsDatas} from '../../../components/Datas';
import { BiChevronDown } from 'react-icons/bi';
import SenderReceverComp from '../../../components/SenderReceverComp';
import { onValue, ref, update } from 'firebase/database';
import { db } from '../../../firebase';

function EditPayment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(sortsDatas.status[1]);
  const [payment, setPayment] = useState();
  const [noTe, setNote] = useState('llll');

  useEffect(()=>{
    
    onValue(ref(db, `Payment/${id}`), snapshot=>{
    if(snapshot.exists()){
    setPayment(snapshot.val());
    const foundStatus = sortsDatas.status.find(item => item.name === (snapshot.val().status));
    setSelected(foundStatus);
    setNote(snapshot.val().adminNote?snapshot.val().adminNote:"");
    }
    else{
    navigate('/admin');
    }
    
    });
        },[id, navigate]);

        const handelPaymentedits= async()=>{
          await update(ref(db, `Payment/${payment.id}`), {
            status: selected.name,
            adminNote: noTe
          });
          toast('Payment Status Update');
        };
  return (
    <Layout>
      <div className="flex items-center gap-4">
        <Link
          to="/payments"
          className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
        >
          <IoArrowBackOutline />
        </Link>
        <h1 className="text-xl font-semibold">Edit Payment</h1>
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
                  : payment?.status === 'Cancel' &&
                    'bg-red-600 text-red-600 border-red-600'
              }
               py-1 border bg-opacity-10 border-opacity-40 rounded-full`}
            >
              {payment?.status}
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:items-end">
            <h6 className="text-xs font-medium">#78291</h6>
            <div className="flex gap-4">
              <p className="text-sm font-extralight">Date:</p>
              <h6 className="text-xs font-medium">12/4/2023</h6>
            </div>
            <div className="flex gap-4">
              <p className="text-sm font-extralight">Due Date:</p>
              <h6 className="text-xs font-medium">15/4/2023</h6>
            </div>
          </div>
        </div>
        {/* sender and recever */}
        <SenderReceverComp item={payment} functions={{}} button={false} />
        {/* products */}
        <div className="grid grid-cols-6 gap-6 mt-8 items-start">
          <div className="lg:col-span-4 col-span-6">
           
            {/* notes */}
            <div className="w-full my-8">
              <p className="text-sm mb-3">Change Status</p>
              <Select
                selectedPerson={selected}
                setSelectedPerson={setSelected}
                datas={sortsDatas?.status}
              >
                <div className="h-14 w-full text-xs text-main rounded-md border border-border px-4 flex items-center justify-between">
                  <p>{selected?.name}</p>
                  <BiChevronDown className="text-xl" />
                </div>
              </Select>
            </div>
            <Textarea
              label="Notes"
              placeholder="Thank you for your business. We hope to work with you again soon!"
              color={true}
              rows={3}
              value={noTe}
              onChange={e=>setNote(e.target.value)}
            />
          </div>
          <div className="lg:col-span-2 col-span-6 flex flex-col gap-6">
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

            <Button
              label="Update"
              onClick={handelPaymentedits}
              Icon={BsSend}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EditPayment;
