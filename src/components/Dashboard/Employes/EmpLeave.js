import React, { useEffect, useState } from "react";
import LeaveService from '../../../Services/LeaveService'
import { LEAVE_STATUS, calculateDays } from "../../../Helper/Helper";

const EmpLeave = ({ userId }) => {
  // states
  const [data, setData] = useState([]);

  // method
  const getAllData = async () => {
    const res = Object.values(await LeaveService.read() || []);
    const arr = [];
    for (let r of res) {
      const date= new Date(r.timeStamp).getDate()
      const month=new Date(r.timeStamp).getMonth()
      const yr=new Date(r.timeStamp).getFullYear()
      if (r.user == userId) {
        arr.push({...r,date:`${date}-${month}-${yr}`});
      }
    }
    setData(arr);
  };

  // Rendering
  useEffect(()=>{
    getAllData()
  },[])

  return (
    <div className="bottom">
      <table>
        <thead>
          <tr>
            <td>Date</td>
            <td>Duration</td>
            <td>Days</td>
            <td>Status</td>
          </tr>
        </thead>
        <tbody>
          {data
            .sort((a, b) => a.from_date.localeCompare(b.from_date))
            .map((emp, key) => (
              <tr key={key}>
                <td data-id={"Date"}>
                  <h3>{emp.date}</h3>
                </td>
                <td data-id={"Duration"}>
                  <h3>{`${emp.from_date} to ${emp.to_date}`}</h3>
                </td>
                <td data-id={"Days"}>
                  <h3>{calculateDays(emp.from_date,emp.to_date)}</h3>
                </td>
                <td data-id={"Status"}>
                  <h3>{
                    emp.status !== LEAVE_STATUS.PENDING ? 
                    (emp.status === LEAVE_STATUS.ACCEPT ? (
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
                        Accept
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
                        Reject
                      </button>
                    )):
                   ( <button
                        style={{
                          backgroundColor: "#EFBE121A",
                          color: "#EFBE12",
                          borderRadius: "5px",
                          padding: "3px",
                          border: "none",
                          fontSize: "11px",
                        }}
                      >
                        Pending
                      </button>)
                  }</h3>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmpLeave;
