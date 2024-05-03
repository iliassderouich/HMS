import React, { useEffect, useState } from 'react';
import Layout from '../../../Layout';
import { Button, FromToDate, Select } from '../../../components/Form';
import { Transactiontable } from '../../../components/Tables';
import { sortsDatas} from '../../../components/Datas';
import { BiChevronDown, BiTime } from 'react-icons/bi';
import {
  MdFilterList,
  MdOutlineCalendarMonth,
  MdOutlineCloudDownload,
} from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { BsCalendarMonth } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useAlluserData, usePaymentData } from '../../../Database';
import { ref, remove } from 'firebase/database';
import { db } from '../../../firebase';

function Payments() {
  const [searchPatient, setSearchPatient]=useState('');
  const [sortBynew, setSortBynew]=useState(true);
  const [status, setStatus] = useState(sortsDatas.status[0]);
  const [method, setMethod] = useState(sortsDatas.method[0]);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  const navigate = useNavigate();
  const [allPayment, setAllPayment] = useState(); 
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const alluserData = useAlluserData();
  const allpaymentData =usePaymentData();

  const todayPayments = allpaymentData?.filter(member=> member.Day===day&&member.Month===month&&member.Year===year);
  
const monthlyPayments = allpaymentData?.filter(member=> member.Month===month&&member.Year===year);

  const yearlyPayments = allpaymentData?.filter(member=>  member.Year===year);

  const sorts = [
    {
      id: 2,
      selected: status,
      setSelected: setStatus,
      datas: sortsDatas.status,
    },
    {
      id: 3,
      selected: method,
      setSelected: setMethod,
      datas: sortsDatas.method,
    },
  ];
  // boxes
  const boxes = [
    {
      id: 1,
      title: 'Today Payments',
      value: todayPayments.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0),
      color: ['bg-hkj-subMain', 'text-subMain'],
      icon: BiTime,
    },
    {
      id: 2,
      title: 'Monthly Payments',
      value: monthlyPayments.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0),
      color: ['bg-hkj-subMain', 'text-orange-500'],
      icon: BsCalendarMonth,
    },
    {
      id: 3,
      title: 'Yearly Payments',
      value: yearlyPayments.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0),
      color: ['bg-hkj-subMain', 'text-green-500'],
      icon: MdOutlineCalendarMonth,
    },
  ];

  const editPayment = (id) => {
    navigate(`/payments/edit/${id}`);
  };
  // preview
  const previewPayment = (id) => {
    navigate(`/payments/preview/${id}`);
  };

  ///Delete item
const handeldeleteitem=async(id)=>{
  try{
remove(ref(db, `Payment/${id}`));
toast("Delete Payment Sucess")
}
catch(err){
  toast("Try to next time");
}
};

  useEffect(()=>{
    
    if(status.name==="Newest Patients"){
      setSortBynew(true);
    
    }
    else{
      setSortBynew(false);
    };

    const allpaymentDataoutput = allpaymentData.map(item => {
      const user = alluserData.find(user => user.id === item.patientID);
      return { ...item, patientName: user ? user.Surename : "Unknown", patientAvater: user ? user.avater : null};
  });
    const filterPayment = allpaymentDataoutput
    ?.filter(member => 
        member.patientName?.toLowerCase().includes(searchPatient.toLowerCase()) && 
      (
        (method.name === "Cash" && member.method === "Cash") || 
        (method.name === "NFC" && member.method === "NFC") || 
        (method.name !== "Cash" && method.name !== "NFC")
      )

      &&

      (
        (status.name === "Paid" && member.status === "Paid") || 
        (status.name === "Cancelled" && member.status === "Canceled") || 
        (status.name === "Pending" && member.status === "Pending") || 
        (status.name !== "Paid" && status.name !== "Canceled" && status.name !== "Pending") // Fixed this line
      )
    )
    .sort((a, b) => sortBynew ? b.ms - a.ms : a.ms - b.ms);

    setAllPayment(filterPayment);
    console.log(status.name)
    
      },[navigate, status, alluserData, allpaymentData, searchPatient, sortBynew, method.name, status.name]);


      ////Filter With Time
      const handelFilterwithTimepriod=async()=>{
        const filteredData = allPayment.filter(item => {
          const itemDate = new Date(item.Year, item.Month - 1, item.Day); 
          return itemDate >= startDate && itemDate <= endDate;
      });
    
      if(filteredData.length>0){
      setAllPayment(filteredData);
      }
      else{
        toast.error('Filter data is not available yet');
      }
      };  

  return (
    <Layout>
      {/* add button */}
      <button
        onClick={() => {
          toast.error('Exporting is not available yet');
        }}
        className="w-16 hover:w-44 group transitions hover:h-14 h-16 border border-border z-50 bg-hkj-subMain text-white rounded-full flex-rows gap-4 fixed bottom-8 right-12 button-fb"
      >
        <p className="hidden text-sm group-hover:block">Export</p>
        <MdOutlineCloudDownload className="text-2xl" />
      </button>
      <h1 className="text-xl font-semibold">Payments</h1>
      {/* boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {boxes.map((box) => (
          <div
            key={box.id}
            className="bg-white flex-btn gap-4 rounded-xl border-[1px] border-border p-5"
          >
            <div className="w-3/4">
              <h2 className="text-sm font-medium">{box.title}</h2>
              <h2 className="text-xl my-6 font-medium">{box.value}</h2>
              <p className="text-xs text-textGray">
                You made <span className={box.color[1]}>{box.value}</span>{' '}
                transactions{' '}
                {box.title === 'Today Payments'
                  ? 'today'
                  : box.title === 'Monthly Payments'
                  ? 'this month'
                  : 'this year'}
              </p>
            </div>
            <div
              className={`w-10 h-10 flex-colo rounded-md text-white text-md ${box.color[0]}`}
            >
              <box.icon />
            </div>
          </div>
        ))}
      </div>
      {/* datas */}
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="10"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        <div className="grid lg:grid-cols-5 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2">
          <input
          value={searchPatient}
          onChange={e=> setSearchPatient(e.target.value)}
            type="text"
            placeholder='Search "Patients"'
            className="h-14 text-sm text-main rounded-md bg-dry border border-border px-4"
          />
          {/* sort  */}
          {sorts.map((item) => (
            <Select
              key={item.id}
              selectedPerson={item.selected}
              setSelectedPerson={item.setSelected}
              datas={item.datas}
            >
              <div className="h-14 w-full text-xs text-main rounded-md bg-dry border border-border px-4 flex items-center justify-between">
                <p>{item.selected.name}</p>
                <BiChevronDown className="text-xl" />
              </div>
            </Select>
          ))}
          {/* date */}
          <FromToDate
            startDate={startDate}
            endDate={endDate}
            bg="bg-dry"
            onChange={(update) => setDateRange(update)}
          />
          {/* export */}
          <Button
            label="Filter"
            Icon={MdFilterList}
            onClick={handelFilterwithTimepriod}
          />
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <Transactiontable
            data={allPayment}
            action={true}
            functions={{
              edit: editPayment,
              preview: previewPayment,
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

export default Payments;
