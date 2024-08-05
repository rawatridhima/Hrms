import React, { useEffect, useState } from "react";
import { PiUsersThree } from "react-icons/pi";
import { RiBriefcase4Line } from "react-icons/ri";
import EmployeeService from "../../Services/EmployeeService";
import CandidateService from "../../Services/CandidateService";
import AttendanceService from "../../Services/AttendanceService";
import { FaRegCalendarCheck } from "react-icons/fa";
import { ATTENDANCE_OPTIONS, LEAVE_STATUS, monthNames } from "../../Helper/Helper";
import Attendance from "./Attendance/Attendance";
import { useNavigate } from "react-router-dom";

const DashBoardBox = ({x}) => {
  // states
  const [emp, setEmp] = useState([]);
  const [can, setCan] = useState([]);
  const [att, setAtt] = useState([]);
  const [data, setData] = useState([]);
  const [comp,setComp]=useState("")

  // methods
  const getInfo = async () => {
    const res1 = await EmployeeService.totalEmployees();
    setEmp(res1);
    const res2 = await CandidateService.totalCandidates();
    setCan(res2);
    const res3 = await AttendanceService.noOfAttendance();
    setAtt(res3);
  };
  const getEmp = async () => {
    const curr = new Date(Date.now()).toISOString().slice(0, 10);
    const res = Object.values((await AttendanceService.read()) || []);
    const val=[]
    for (let r of res) {
      const d = new Date(r.date).toISOString().slice(0, 10);
      
      if (d == curr) {
        const e = await EmployeeService.getEmployessById(r.user);
        val.push({
          ...r,
          ...e,
        });
        setData(val)
      }
    }
  };

  // rendering
  useEffect(() => {
    getInfo();
    getEmp();
    console.log(data)
  }, []);

  return (
    <div className="whole">
      <div className="up">
        <div className="contain">
          <div className="head">
            <PiUsersThree className="icon" />
            <h4>Total Employees</h4>
          </div>
          <h3>{emp[0]}</h3>
          <h5>{`Update: ${monthNames[new Date(emp[1]).getMonth()]} ${new Date(
            emp[1]
          ).getDate()} , ${new Date(emp[1]).getFullYear()}`}</h5>
        </div>
        <div className="contain">
          <div className="head">
            <RiBriefcase4Line className="icon" />
            <h4>Total Applicant</h4>
          </div>
          <h3>{can[0]}</h3>
          <h5>{`Update: ${monthNames[new Date(can[1]).getMonth()]} ${new Date(
            can[1]
          ).getDate()} , ${new Date(can[1]).getFullYear()}`}</h5>
        </div>
        <div className="contain">
          <div className="head">
            <FaRegCalendarCheck className="icon" />
            <h4>Todays Attendance</h4>
          </div>
          <h3>{att[0]}</h3>
          <h5>{`Update: ${monthNames[new Date(att[1]).getMonth()]} ${new Date(
            att[1]
          ).getDate()} , ${new Date(att[1]).getFullYear()}`}</h5>
        </div>
      </div>
      <div className="mid"></div>
      <div className="low">
        <div className="top">
          <h3>Attendance Overview</h3>
          <button onClick={
            ()=>{
             x(3)
            }
          }> View All
          
          </button>
        </div>
        <div className="bottom">
          
              <table>
                <thead>
                  <tr>
                  <td>Employee Name</td>
                  <td>Designation</td>
                  <td>Type</td>
                  <td>Status</td>
                  </tr>
                </thead>
                <tbody>
                {console.log(data)}
                  {
                    data.slice(0,5).map((x,y)=>(
                      <tr key={y}>
                      <td data-id={"Employee Name"}>
                          <div className="table-box">
                            <img src={x[0].profile} alt="" />
                            <h3>{x[0].name}</h3>
                          </div>
                        </td>
                        <td data-id={"Designation"}>
                          <h3> {x[0].designation} </h3>
                        </td>
                        <td data-id={"Type"}>
                          <h3> {x[0].emp_type} </h3>
                        </td>
                        <td data-id={"Status"}>
                        <h3>{
                   
                    (x.status === ATTENDANCE_OPTIONS.PRESENT ? (
                      <button
                        style={{
                          backgroundColor: "#3FC28A1A",
                          color: "#3FC28A",
                          borderRadius: "5px",
                          padding: "4px",
                          fontSize: "11px",
                          border: "none",
                        }}
                      >
                        Present
                      </button> 
                    ):(
                      <button
                        style={{
                          backgroundColor: "#F45B691A",
                          color: "#F45B69",
                          borderRadius: "5px",
                          padding: "3px",
                          border: "none",
                          fontSize: "11px",
                        }}
                      >
                       Absent
                      </button>
                    ))
                  }</h3>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
           
          
        </div>
      </div>
    </div>
  );
};

export default DashBoardBox;
