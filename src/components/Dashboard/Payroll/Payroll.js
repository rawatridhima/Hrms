import React, { useEffect, useRef, useState } from "react";
import SearchBar from "../../../Helper/SearchBar/SearchBar";
import "./Payroll.css";
import "../Employes/Employes.css";
import EmployeeService from "../../../Services/EmployeeService";
import Loader from "../../Loader/Loader";
import {
  LEAVE_TYPES,
  Roles,
  monthNames,
  monthlySalary,
  normalizeNum,
} from "../../../Helper/Helper";
import { IoPrintSharp } from "react-icons/io5";
import {
  FaAngleLeft,
  FaAngleRight,
  FaArrowLeft,
  FaDownload,
  FaEye,
} from "react-icons/fa";
import toast from "react-hot-toast";
import LeaveService from "../../../Services/LeaveService";
import AttendanceService from "../../../Services/AttendanceService";
import HolidaysService from "../../../Services/HolidaysService";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";

const Payroll = () => {
  // states
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [loader, setLoader] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [empInfo, setEmpInfo] = useState("");
  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    documentTitle: "Print Salary Slip",
    removeAfterPrint: true,
  });
  const auth = useSelector((x) => x.auth);

  // handling methods

  const handleShow = async () => {
    if (month && year) {
      const curr = new Date(Date.now());
      const flag1 = month <= curr.getMonth() && curr.getFullYear() >= year;
      const flag2 = curr.getMonth() === 0 && curr.getFullYear() > year;
      if (flag1 || flag2) {
        setLoader(true);
        setShow(true);
        const val = [];
        let emps = [];
        if (auth.user?.role === Roles.USER) {
          emps =[await EmployeeService.read(auth.user?.id)] ;
        } else {
          emps = await EmployeeService.getAllEmployees();
        }
        for (let emp of emps) {
          const joining_month = new Date(emp.joining_date).getMonth();
          const joining_year = new Date(emp.joining_date).getFullYear();
          if (year == joining_year && month >= joining_month) {
            const parameters = await AttendanceService.giveParameters(
              month,
              year,
              emp.id,
              emp.ctc
            );
            val.push({
              ...emp,
              ...parameters,
            });
            setEmployee(val);
          }
        }

        const perPage = val.length / itemsPerPage;
        setMaxPage(
          Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
        );
        setLoader(false);
      } else toast.error("We cant show you the future salaries.");
    } else toast.error("Select Month and Year first!!");
  };
  const handleChange = async () => {
    setLoader(true);
    const updatedVal = [];
    employee.forEach((x) => {
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

  useEffect(() => {
    if (month && year) {
      if (search.length > 0) {
        const timer = setTimeout(() => {
          handleChange();
        }, 500);
        return () => clearTimeout(timer);
      }
      setEmployee([]);
    }
  }, [search, year, month]);

  if (showModal)
    return (
      <div className="modal">
        <FaArrowLeft className="icon" onClick={() => setShowModal(false)} />
        <div className="all" ref={contentToPrint}>
          <div className="heading">
            <h1>Salary Slip</h1>
          </div>
          <div className="empInfo">
            <h3>
              {" "}
              <span>Employee Name :</span> {` ${empInfo.name}`}
            </h3>
            <h3>
              <span>Designation :</span> {` ${empInfo.designation}`}
            </h3>
            <h3>
              <span>Month :</span>
              {` ${monthNames[month]} ${year}`}
            </h3>
          </div>
          <div className="paySlip">
            <table>
              <thead>
                <tr>
                  <td id="frst">Description</td>
                  <td id="lst">Amount</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td id="frst">CTC</td>
                  <td id="lst">{normalizeNum(empInfo.ctc)}</td>
                </tr>
                <tr>
                  <td id="frst">Gross Salary</td>
                  <td id="lst">{empInfo.gross_salary}</td>
                </tr>
                <tr>
                  <td id="frst">HRA</td>
                  <td id="lst">{empInfo.hra}</td>
                </tr>
                <tr>
                  <td id="frst">DA</td>
                  <td id="lst">{empInfo.da}</td>
                </tr>
                <tr>
                  <td id="frst">Basic Salary</td>
                  <td id="lst">{empInfo.basic_salary}</td>
                </tr>
                <tr>
                  <td id="frst">PF</td>
                  <td id="lst">{empInfo.pf}</td>
                </tr>
                <tr>
                  <td id="frst">ESI</td>
                  <td id="lst">{empInfo.esi}</td>
                </tr>
                <tr>
                  <td id="frst">Deductions</td>
                  <td id="lst">{empInfo.deductions}</td>
                </tr>
                <tr>
                  <td id="frst">Net Salary</td>
                  <td id="lst">{empInfo.net_salary}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text">
            <div className="left">
              <p>
                For any queries , Please contact at 9856342712 or mail us at
                hrms12@gmail.com .
              </p>
              <h5>Regards</h5>
              <h5>HRMS</h5>
              <h5>Founder:XYZ Private Limited.</h5>
            </div>
            <div className="right">
              <img
                src={require("../../../Assests/images/signature.jpeg")}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="downloadBtn">
          <button
            onClick={() => {
              handlePrint(null, () => contentToPrint.current);
            }}
          >
            <FaDownload />
            Print
          </button>
        </div>
      </div>
    );
  else
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
        ) : year === "" || month === "" || show === false ? (
          <h3 className="empty-text-signal">Select a Month & Year First</h3>
        ) : employee.length === 0 ? (
          <h3 className="empty-text-signal">No Employee is here!!</h3>
        ) : (
          <div className="bottom">
            <table>
              <thead>
                <tr>
                  <td>Employee Name</td>
                  <td>CTC</td>
                  <td>Salary Per Month</td>
                  <td>Deduction</td>
                  <td>Salary Slip</td>
                </tr>
              </thead>
              <tbody>
                {employee
                  .sort((a, b) => a.empId.localeCompare(b.empId))
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((emp, key) => {
                    return (
                      <tr key={key}>
                        <td data-id={"Employee Name"}>
                          <div className="table-box">
                            <img src={emp.profile} alt="" />
                            <h3>{emp.name}</h3>
                          </div>
                        </td>
                        <td data-id={"CTC"}>
                          <h3> {normalizeNum(emp.ctc)} </h3>
                        </td>
                        <td data-id={"Salary Per Month"}>
                          <h3> {emp.net_salary} </h3>
                        </td>
                        <td data-id={"Deduction"}>{emp.deductions}</td>
                        <td
                          data-id={"Salary Slip"}
                          onClick={() => {
                            setShowModal(true);
                            setEmpInfo(emp);
                          }}
                        >
                          {" "}
                          {<IoPrintSharp />}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
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
};

export default Payroll;
