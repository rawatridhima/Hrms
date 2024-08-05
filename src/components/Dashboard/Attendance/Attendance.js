import React, { useEffect, useState } from "react";
import SearchBar from "../../../Helper/SearchBar/SearchBar";
import Loader from "../../Loader/Loader";
import EmployeeService from "../../../Services/EmployeeService";
import AttendanceService from "../../../Services/AttendanceService";
import toast from "react-hot-toast";
import {
  ATTENDANCE_OPTIONS,
  Roles,
  formatDate,
  monthNames,
  weekday,
} from "../../../Helper/Helper";
import { FaAngleLeft, FaAngleRight, FaEye } from "react-icons/fa";
import "./Attendance.css";
import { useSelector } from "react-redux";

const Attendance = () => {
  // states
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [loader, setLoader] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const auth = useSelector((x) => x.auth);
  const [show, setShow] = useState(false);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [data, setData] = useState([]);

  // handling methods
  const getAllEmployees = async () => {
    setLoader(true);
    const val = [];
    const all_emps = await EmployeeService.getAllEmployees();
    for (let emp of all_emps) {
      val.push({
        ...emp,
        attendance: await AttendanceService.attendanceExist(emp.id, date),
      });
    }
    setEmployee(val);
    const perPage = val.length / itemsPerPage;
    setMaxPage(
      Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
    );
    setLoader(false);
  };
  const handleChange = async () => {
    setLoader(true);
    const val = [];
    const all_emps = await EmployeeService.getAllEmployees();
    for (let emp of all_emps) {
      val.push({
        ...emp,
        attendance: await AttendanceService.attendanceExist(emp.id, date),
      });
    }
    const updatedVal = [];
    val.forEach((x) => {
      if (x.name.toLowerCase().includes(search.toLocaleLowerCase()))
        updatedVal.push(x);
      setEmployee(updatedVal);
      const perPage = updatedVal.length / itemsPerPage;
      setMaxPage(
        Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
      );
      setPage(1);
      setLoader(false);
    });
  };
  const markAttendance = async (data) => {
    // setLoader(true);
    const attendance = await AttendanceService.attendanceExist(
      data.user,
      data.date
    );
    if (attendance) {
      await AttendanceService.update(attendance.id, data);
      toast.success("Attendance Status Updated to " + data.status);
    } else {
      await AttendanceService.create(data);
      toast.success("Attendance Status Marked to " + data.status);
    }
    if (search) await handleChange();
    else await getAllEmployees();
    // setLoader(false);
  };
  const handleShow = async () => {
    setData([]);
    setLoader(true);
    const res = Object.values((await AttendanceService.read()) || []);
    const arr = [];
    for (let r of res) {
      const currMonth = new Date(r.date).getMonth();
      const currYear = new Date(r.date).getFullYear();
      if (r.user == auth.user.id && currMonth == month && currYear == year) {
        console.log(currMonth, month);
        arr.push({ ...r });
        setData(arr);
      }
    }

    setLoader(false);
  };

  // rendering
  useEffect(() => {
    if (date) {
      if (search.length > 0) {
        const timer = setTimeout(() => {
          handleChange();
        }, 500);
        return () => clearTimeout(timer);
      } else getAllEmployees();
    }
  }, [search, date]);

  if (auth.user?.role !== Roles.USER) {
    return (
      <div className="Employee">
        <div className="top">
          <SearchBar onChange={(e) => setSearch(e.target.value)} />
          <div className="btns">
            <input
              type="text"
              placeholder="Date"
              value={date}
              onFocus={(e) => {
                e.target.type = "date";
              }}
              onBlur={(e) => {
                if (e.target.value == "") e.target.type = "text";
              }}
              onChange={(e) =>
                setDate((prev) => {
                  if (new Date(e.target.value) <= new Date(Date.now()))
                    return e.target.value;
                  toast.error(`You can't mark an attendance for future.`);
                  return prev;
                })
              }
            />
          </div>
        </div>
        {loader ? (
          <Loader fullWidth={true} size={50} />
        ) : date === "" ? (
          <h3 className="empty-text-signal">Select a Date First</h3>
        ) : employee.length === 0 ? (
          <h3 className="empty-text-signal">No Employee is here!!</h3>
        ) : (
          <div className="bottom">
            <table>
              <thead>
                <tr>
                  <td>Employee Name</td>
                  <td>Desgination</td>
                  <td>Office Location</td>
                  <td>Date</td>
                  <td>Status</td>
                  <td>Mark Attendance</td>
                </tr>
              </thead>
              <tbody>
                {employee
                  .sort((a, b) => a.empId.localeCompare(b.empId))
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((emp, key) => {
                    return (
                      <tr key={key}>
                        <td
                          data-id={"Employee Name"}
                          style={{
                            borderLeft: `5px solid var(--${
                              emp.attendance
                                ? emp.attendance.status ===
                                  ATTENDANCE_OPTIONS.PRESENT
                                  ? "secColor-1"
                                  : "textColor-3"
                                : "textColor-2"
                            })`,
                          }}
                        >
                          <div className="table-box">
                            <img src={emp.profile} alt="" />
                            <h3>{emp.name}</h3>
                          </div>
                        </td>
                        <td data-id={"Designation"}>
                          <h3>{emp.designation}</h3>
                        </td>
                        <td data-id={"Office Location"}>
                          <h3>{emp.office_location}</h3>
                        </td>
                        <td data-id={"Date"}>
                          <h3>{formatDate(date)}</h3>
                        </td>
                        <td data-id={"Status"} className="color-td">
                          <h3>
                            {emp.attendance?.isHoliday
                              ? "Holiday"
                              : emp.attendance?.isLeave
                              ? "Leave"
                              : emp.attendance?.status || "Not Marked"}
                          </h3>
                        </td>
                        <td data-id={"Mark Attendance"}>
                          {emp.attendance?.isHoliday ||
                          emp.attendance?.isLeave ? (
                            <h3>#</h3>
                          ) : (
                            <div className="table-box">
                              {emp.attendance ? (
                                emp.attendance.status ===
                                ATTENDANCE_OPTIONS.PRESENT ? (
                                  <button
                                    style={{
                                      backgroundColor: "#F45B691A",
                                      color: "#F45B69",
                                      borderRadius: "5px",
                                      padding: "3px",
                                      border: "none",
                                      fontSize: "11px",
                                    }}
                                    onClick={() =>
                                      markAttendance({
                                        status: ATTENDANCE_OPTIONS.ABSENT,
                                        user: emp.id,
                                        date,
                                      })
                                    }
                                  >
                                    A
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
                                    onClick={() =>
                                      markAttendance({
                                        status: ATTENDANCE_OPTIONS.PRESENT,
                                        user: emp.id,
                                        date,
                                      })
                                    }
                                  >
                                    P
                                  </button>
                                )
                              ) : (
                                <>
                                  <button
                                    style={{
                                      backgroundColor: "#3FC28A1A",
                                      color: "#3FC28A",
                                      borderRadius: "5px",
                                      padding: "4px",
                                      fontSize: "11px",
                                      border: "none",
                                    }}
                                    onClick={() =>
                                      markAttendance({
                                        status: ATTENDANCE_OPTIONS.PRESENT,
                                        user: emp.id,
                                        date,
                                      })
                                    }
                                  >
                                    P
                                  </button>
                                  <button
                                    style={{
                                      backgroundColor: "#F45B691A",
                                      color: "#F45B69",
                                      borderRadius: "5px",
                                      padding: "3px",
                                      border: "none",
                                      fontSize: "11px",
                                    }}
                                    onClick={() =>
                                      markAttendance({
                                        status: ATTENDANCE_OPTIONS.ABSENT,
                                        user: emp.id,
                                        date,
                                      })
                                    }
                                  >
                                    A
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <div className="keys">
              {[
                { name: "Not Marked", color: `var(--textColor-2)` },
                { name: "Present", color: `var(--secColor-1)` },
                { name: "Absent", color: `var(--textColor-3)` },
              ].map((x, idx) => (
                <div key={idx} className="key">
                  <div
                    style={{ backgroundColor: x.color }}
                    className="circle"
                  ></div>
                  <h3>{x.name}</h3>
                </div>
              ))}
            </div>
            <div style={{ justifyContent: "center" }} className="pagination">
              <div className="paging">
                {page <= 1 ? null : (
                  <FaAngleLeft onClick={() => setPage(page - 1)} />
                )}
                <h3>{page}</h3>
                {page >= maxPage ? null : (
                  <FaAngleRight onClick={() => setPage(page + 1)} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="Employee">
        <div className="top">
          <SearchBar
            onChange={(e) => setSearch(e.target.value)}
            className="search"
          />
          <div className="btns">
            <div className="same">
              <select
                className={year ? "" : "placeholder"}
                onChange={(e) => {
                  if (e.target.value === "-1")
                    e.target.classList.add("placeholder");
                  else e.target.classList.remove("placeholder");
                  setYear(e.target.value);
                }}
              >
                <option selected={year === " " ? true : false} value={-1}>
                  Year
                </option>
                {(() => {
                  const dt = new Date(Date.now());
                  const currYear = dt.getFullYear();
                  const val = [];
                  for (let i = 1980; i <= currYear; i++) {
                    val.push(i);
                  }
                  return val.map((yr, i) => (
                    <option
                      key={i}
                      selected={year === yr ? true : false}
                      value={yr}
                    >
                      {yr}
                    </option>
                  ));
                })()}
              </select>
              <select
                className={month ? "" : "placeholder"}
                onChange={(e) => {
                  if (e.target.value === "-1")
                    e.target.classList.add("placeholder");
                  else e.target.classList.remove("placeholder");
                  setMonth(e.target.value);
                }}
              >
                <option selected={month === " " ? true : false} value={-1}>
                  Month
                </option>
                {monthNames.map((m, i) => (
                  <option
                    key={i}
                    selected={month === i ? true : false}
                    value={i}
                  >
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <button id="addBtn" onClick={() => handleShow()}>
              <FaEye />
              <h3>Show</h3>
            </button>
          </div>
        </div>

        {loader ? (
          <Loader fullWidth={true} size={50} />
        ) : month == "-1" || year == "-1" ? (
          <h3 className="empty-text-signal">Select Month & Year First</h3>
        ) : data.length === 0 ? (
          <h3 className="empty-text-signal">No Attendance is here!!</h3>
        ) : (
          <div className="bottom">
            <table>
              <thead>
                <tr>
                  <td>Date</td>
                  <td>Day</td>
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
                      <td data-id={"Day"}>
                        <h3>{`${weekday[new Date(emp.date).getDay()]}`}</h3>
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
        )}
      </div>
    );
  }
};

export default Attendance;
