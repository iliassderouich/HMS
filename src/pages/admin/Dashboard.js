import React from 'react';
import Layout from '../../Layout';
import {
  BsArrowDownLeft,
  BsArrowDownRight,
  BsArrowUpRight,
} from 'react-icons/bs';
import { DashboardSmallChart } from '../../components/Charts';
import { Transactiontable } from '../../components/Tables';
import { Link } from 'react-router-dom';
import { useAlluserData, useAppointmentsData, usePaymentData } from '../../Database';
import { TbCalendar, TbUsers } from 'react-icons/tb';
import { MdOutlineAttachMoney } from 'react-icons/md';

function Dashboard() {
  const allUserData = useAlluserData();
  const allPaymentData = usePaymentData();
  const allpaymentDataoutput = allPaymentData.map(item => {
    const user = allUserData.find(user => user.id === item.patientID);
    return { ...item, patientName: user ? user.Surename : "Unknown", patientAvater: user ? user.avater : null};
});
  const allAppointmentData = useAppointmentsData();


  const dashboardCards = [
    {
      id: 1,
      title: 'Total Patients',
      icon: TbUsers,
      value:allUserData?.filter(member => member.Role === "patient").length,
      percent: 145.06,
      color: ['bg-hkj-subMain', 'text-hkj-subMain', '#001B5A'],
      datas: [2, 5],
    },
    {
      id: 2,
      title: 'Appointments',
      icon: TbCalendar,
      value: allAppointmentData.length,
      percent: 25.06,
      color: ['bg-hkj-subMain', 'text-hkj-subMain', '#001B5A'],
      datas: [20, 50, 75, 15, 108, 97, 70, 41, 50, 20, 90, 60],
    },
    {
      id: 4,
      title: 'Total Earnings',
      icon: MdOutlineAttachMoney,
      value: allPaymentData.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0),
      percent: 45.06,
      color: ['bg-hkj-subMain', 'text-hkj-subMain', '#001B5A'],
      datas: [20, 50, 75, 15, 108, 97, 70, 41, 50, 20, 90, 60],
    },
  ];

  return (
    <Layout>
      {/* boxes */}
      <div className="w-full grid xl:grid-cols-3 gap-6 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {dashboardCards.map((card, index) => (
          <div
            key={card.id}
            className=" bg-white rounded-xl border-[1px] border-border p-5"
          >
            <div className="flex gap-4 items-center">
              <div
                className={`w-10 h-10 flex-colo bg-opacity-10 rounded-md ${card.color[1]} ${card.color[0]}`}
              >
                <card.icon />
              </div>
              <h2 className="text-sm font-medium">{card.title}</h2>
            </div>
            <div className="grid grid-cols-8 gap-4 mt-4 bg-dry py-5 px-8 items-center rounded-xl">
              <div className="col-span-5">
                {/* statistc */}
                <DashboardSmallChart data={card.datas} colors={card.color[2]} />
              </div>
              <div className="flex flex-col gap-4 col-span-3">
                <h4 className="text-md font-medium">
                  {card.value}
                  {
                    // if the id === 4 then add the $ sign
                    card.id === 4 ? '$' : '+'
                  }
                </h4>
                <p className={`text-sm flex gap-2 ${card.color[1]}`}>
                  {card.percent > 50 && <BsArrowUpRight />}
                  {card.percent > 30 && card.percent < 50 && (
                    <BsArrowDownRight />
                  )}
                  {card.percent < 30 && <BsArrowDownLeft />}
                  {card.percent}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full my-6 grid xl:grid-cols-8 grid-cols-1 gap-6">
        <div className="xl:col-span-6  w-full">
          
          {/* transaction */}
          <div className="mt-6 bg-white rounded-xl border-[1px] border-border p-5">
            <div className="flex-btn gap-2">
              <h2 className="text-sm font-medium">Recent Transaction</h2>
              
            </div>
            {/* table */}
            <div className="mt-4 overflow-x-scroll">
              <Transactiontable
                data={allpaymentDataoutput.slice(0, 5)}
                action={false}
              />
            </div>
          </div>
        </div>
        {/* side 2 */}
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="10"
          data-aos-offset="200"
          className="xl:col-span-2 xl:block grid "
        >
          {/* recent patients */}
          <div className="bg-white rounded-xl border-[1px] border-border p-5">
            <h2 className="text-sm font-medium">Recent Patients</h2>
            {allUserData?.slice(0, 8).filter(member => member.Role === "patient").map((member, index) => (
              <Link
                to={`/patients/preview/${member.id}`}
                key={index}
                className="flex-btn gap-4 mt-6 border-b pb-4 border-border"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={member.avater}
                    alt="member"
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xs font-medium">{member.Surename}</h3>
                    <p className="text-xs text-gray-400">{member.Phone}</p>
                  </div>
                </div>
                <p className="text-xs text-textGray">2:00 PM</p>
              </Link>
            ))}
          </div>
      
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
