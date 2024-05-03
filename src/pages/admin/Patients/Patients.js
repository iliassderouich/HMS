import React, { useEffect, useState } from 'react';
import Layout from '../../../Layout';
import { sortsDatas } from '../../../components/Datas';
import { Link, useNavigate } from 'react-router-dom';
import { BiChevronDown, BiPlus, BiTime } from 'react-icons/bi';
import { BsCalendarMonth } from 'react-icons/bs';
import { MdFilterList, MdOutlineCalendarMonth } from 'react-icons/md';
import { Button, FromToDate, Select } from '../../../components/Form';
import { PatientTable } from '../../../components/Tables';
import { useAlluserData } from '../../../Database';
import toast from 'react-hot-toast';
import { ref, remove } from 'firebase/database';
import { db } from '../../../firebase';

function Patients() {
  const [searchPatient, setSearchPatient]=useState('');
  const [sortBynew, setSortBynew]=useState(true);
  const [status, setStatus] = useState(sortsDatas.filterPatient[0]);
  const [gender, setGender] = useState(sortsDatas.genderFilter[0]);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  const navigate = useNavigate();
  const alluserData = useAlluserData();
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

const [allPatient, setAllpatient] = useState(); 



  const todayPatients = alluserData?.filter(member => member.Role === "patient" &&
                        member.Day===day&&member.Month===month&&member.Year===year).length;
  
const monthlyPatients = alluserData?.filter(member => member.Role === "patient" &&
                         member.Month===month&&member.Year===year).length;

  const yearlyPatients = alluserData?.filter(member => member.Role === "patient" &&
                        member.Year===year).length;

  const sorts = [
    {
      id: 2,
      selected: status,
      setSelected: setStatus,
      datas: sortsDatas.filterPatient,
    },
    {
      id: 3,
      selected: gender,
      setSelected: setGender,
      datas: sortsDatas.genderFilter,
    },
  ];
  // boxes
  const boxes = [
    {
      id: 1,
      title: 'Today Patients',
      value: todayPatients,
      color: ['bg-hkj-subMain', 'text-subMain'],
      icon: BiTime,
    },
    {
      id: 2,
      title: 'Monthly Patients',
      value: monthlyPatients,
      color: ['bg-hkj-subMain', 'text-orange-500'],
      icon: BsCalendarMonth,
    },
    {
      id: 3,
      title: 'Yearly Patients',
      value: yearlyPatients,
      color: ['bg-hkj-subMain', 'text-green-500'],
      icon: MdOutlineCalendarMonth,
    },
  ];

 

  const handelFilterwithTimepriod=async()=>{
    const filteredData = allPatient.filter(item => {
      const itemDate = new Date(item.Year, item.Month - 1, item.Day); 
      return itemDate >= startDate && itemDate <= endDate;
  });

  if(filteredData.length>0){
  setAllpatient(filteredData);
  }
  else{
    toast.error('Filter data is not available yet');
  }
  };

  useEffect(()=>{
    
    if(status.name==="Newest Patients"){
      setSortBynew(true);
    
    }
    else{
      setSortBynew(false);
    };

    const filterPatient = alluserData
    ?.filter(member => 
      member.Role === "patient" &&
      member.Surename?.toLowerCase().includes(searchPatient.toLowerCase()) && 
      (
        (gender.name === "Male" && member.gender === "Male") || 
        (gender.name === "Female" && member.gender === "Female") || 
        (gender.name !== "Male" && gender.name !== "Female")
      )
    )
    .sort((a, b) => sortBynew ? b.ms - a.ms : a.ms - b.ms);

    setAllpatient(filterPatient);
    
      },[status, alluserData, searchPatient, sortBynew, gender.name]);


 // preview
 const previewPayment = (id) => {
  navigate(`/patients/preview/${id}`);
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
      {/* add button */}
      <Link
        to="/patients/create"
        className="w-16 animate-bounce h-16 border border-border z-50 bg-hkj-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </Link>
      <h1 className="text-xl font-semibold">Patients</h1>
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
                Total Patients <span className={box.color[1]}>{box.value}</span>{' '}
                {box.title === 'Today Patients'
                  ? 'today'
                  : box.title === 'Monthly Patients'
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
            type="text"
            value={searchPatient}
            onChange={e=> setSearchPatient(e.target.value)}
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
          <PatientTable
            data={allPatient}
            functions={{
              preview: previewPayment,
            }}
            deleteitem={{
              previewr: handeldeleteitem,
            }}
            used={false}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Patients;
