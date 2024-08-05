import React, { useEffect, useState } from "react";
import AttendanceService from "../../../Services/AttendanceService";
import { ATTENDANCE_OPTIONS} from "../../../Helper/Helper";

const EmpAttendance = ({ userId }) => {
  // states
  const [data, setData] = useState([]);

  // method
  const getAllData = async () => {
    const res = Object.values(await AttendanceService.read());
    const arr = [];
    for (let r of res) {
      if (r.user == userId) {
        arr.push(r);
      }
    }
    setData(arr);
  };

useEffect(()=>{
  getAllData()
},[])

  return (
    <div className="bottom">
      <table>
        <thead>
          <tr>
            <td>Date</td>
            <td>Status</td>
          </tr>
        </thead>
        <tbody>
          {data
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((emp, key) => (
              <tr key={key}>
                <td data-id={"Date"}>
                  <h3>{emp.date}</h3>
                </td>
                <td data-id={"Satus"}>
                  <h3>
                    {emp.status === ATTENDANCE_OPTIONS.ABSENT ? (
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
                    ) : (
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
                    )}
                  </h3>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmpAttendance;
