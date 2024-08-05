import React, { useState, useEffect } from "react";
import "./Departments.css";
import SearchBar from "../../../Helper/SearchBar/SearchBar";
import {
  FaAngleRight,
  FaArrowLeft,
  FaBriefcase,
  FaClipboardList,
  FaPlusCircle,
  FaUser,
} from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import Loader from "../../Loader/Loader";
import toast from "react-hot-toast";
import DepartmentService from "../../../Services/DepartmentService";
import EmployeeService from "../../../Services/EmployeeService";
import { LuCalendarCheck, LuClipboardList } from "react-icons/lu";
import Profile from "../../Dashboard/Employes/Profile";
import EmpAttendance from "../../Dashboard/Employes/EmpAttendance";
import EmpLeave from "../../Dashboard/Employes/EmpLeave";
import { IoBagOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";

const Departments = () => {
  //states
  const [department, setDepartment] = useState(null);
  const [loader, setLoader] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [data, setData] = useState("");
  const [text, setText] = useState("");
  const [empById, setEmpById] = useState([]);
  const [table, setTable] = useState({ isShow: false, data: [] });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState("");
  const [viewEmp, setViewEmp] = useState({ isShow: false, data: {} });
  const [viewComponent, setViewComponent] = useState(0);

  const pages = [
    {
      name: "Personal Information",
      icon: <FaUser />,
      datas: (emp) => [
        {
          name: "First Name",
          val: emp.first_name,
        },
        {
          name: "Last Name",
          val: emp.last_name,
        },
        {
          name: "Mobile Number",
          val: emp.mobile_number,
        },
        {
          name: "Email",
          val: emp.email,
        },
        {
          name: "Date of Birth",
          val: emp.dob,
        },
        {
          name: "Marital Status",
          val: emp.marital_status,
        },
        {
          name: "Gender",
          val: emp.gender,
        },
        {
          name: "Country",
          val: emp.country,
        },
        {
          name: "Address",
          val: emp.address,
        },
        {
          name: "City",
          val: emp.city,
        },
        {
          name: "State",
          val: emp.state,
        },
        {
          name: "Zip Code",
          val: emp.zip_code,
        },
      ],
    },
    {
      name: "Professional Information",
      icon: <FaBriefcase />,
      datas: (emp) => [
        {
          name: "Employee ID",
          val: emp.empId,
        },
        {
          name: "User Name",
          val: emp.user_name,
        },
        {
          name: "Employee Type",
          val: emp.emp_type,
        },
        {
          name: "Department",
          val: emp.department,
        },
        {
          name: "Designation",
          val: emp.designation,
        },
        {
          name: "Joining Date",
          val: emp.joining_date,
        },
        {
          name: "CTC",
          val: emp.ctc,
        },
        {
          name: "Office Location",
          val: emp.office_location,
        },
      ],
    },
    {
      name: "Documents",
      icon: <MdMail />,
      datas: (emp) => [
        {
          name: "Appointment Letter",
          val: emp.appointment_letter,
        },
        {
          name: "Salary Slip",
          val: emp.salary_slips,
        },
        {
          name: "Reliving Letter",
          val: emp.reliving_letter,
        },
        {
          name: "Experience Letter",
          val: emp.experience_letter,
        },
      ],
    },
    {
      name: "Account Access",
      icon: <IoIosLock />,
      datas: (emp) => [
        {
          name: "Linkedin ID",
          val: emp.linkedin_url,
        },
        {
          name: "Slack ID",
          val: emp.slack_url,
        },
        {
          name: "Skype ID",
          val: emp.skype_url,
        },
        {
          name: "Github ID",
          val: emp.github_url,
        },
      ],
    },
  ];
  const ViewProfileArr = [
    {
      name: "Profile",
      icon: <FaUser />,
      component: <Profile pages={pages} emp={viewEmp.data} />,
    },
    {
      name: "Attendance",
      icon: <LuCalendarCheck />,
      component: <EmpAttendance />,
    },
  
    {
      name: "Leave",
      icon: <LuClipboardList />,
      component: <EmpLeave />,
    },
  ];

  //functions
  const handleAdd = async (e) => {
    e.preventDefault();
    setLoader(true);
    if (data.name) {
      let isContain = false;
      department.forEach((x) => {
        if (x.name.toLowerCase() === data.name.toLowerCase) isContain = true;
      });
      if (isContain) toast.error("Department Already Exists!");
      else {
        await DepartmentService.create(data);
        toast.success("Department Added Successfully!");
        setShowAddModal(false);
      }
    } else {
      toast.error("All fields are mandatory.");
      setLoader(false);
    }
  };

  const getAllDepartments = async () => {
    setLoader(true);
    const val = await DepartmentService.read();
    setDepartment(val === null ? [] : Object.values(val));
    setLoader(false);
  };

  const handleChange = async () => {
    setLoader(true);
    const val = Object.values(await DepartmentService.read());
    const updatedVal = [];
    val.forEach((x) => {
      if (x.name.toLowerCase().includes(text.toLowerCase())) updatedVal.push(x);
    });
    setDepartment(updatedVal);
    setLoader(false);
  };

  const getEmployeesByDep = async () => {
    setLoader(true);
    setEmpById(await EmployeeService.getEmployessByDep());
    setLoader(false);
  };
  const handleEmpClick = (depID) => {
    setLoader(true);
    setTable(() => {
      const data = empById[depID];
      const perPage = data.length / itemsPerPage; //11/10 = 1.1
      setMaxPage(
        Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
      );
      setPage(1);
      return { isShow: true, data };
    });
    setLoader(false);
  };
  const handleChangePageItem = (e) => {
    setPage(1); //Starting from first page
    const val = Number(e.target.value);
    setItemsPerPage(val);
    const perPage = table.data?.length / val;
    setMaxPage(
      Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
    );
  };

  useEffect(() => {
    if (!showAddModal) {
      if (text.length > 0) {
        const timer = setTimeout(() => {
          handleChange();
        }, 500);
        return () => clearTimeout(timer);
      } else {
        getAllDepartments();
        getEmployeesByDep();
      }
    }
  }, [showAddModal, text]);

  if (viewEmp.isShow)
    return (
      <div className="view">
        <div className="view-top">
          <div className="left">
            <img src={viewEmp.data?.profile} alt="" />
            <div className="info">
              <h3>{viewEmp.data?.name}</h3>
              <div className="frame">
                <IoBagOutline />
                <h4> {viewEmp.data?.designation}</h4>
              </div>
              <div className="frame">
                <MdOutlineMailOutline />
                <h4> {viewEmp.data?.email}</h4>
              </div>
            </div>
          </div>
          <div className="right">
            <div
              className="btn"
              onClick={() => {
                setViewEmp({
                  isShow: false,
                  data: {},
                });
              }}
            >
              <FaArrowLeft />
              <h5>Back</h5>
            </div>
          </div>
        </div>
        <div className="view-bottom">
          <div className="left-box">
            {ViewProfileArr.map((nav, idx) => (
              <button
                className={idx === viewComponent ? "active" : " "}
                onClick={() => setViewComponent(idx)}
              >
                {nav.icon}
                <h3>{nav.name}</h3>
              </button>
            ))}
          </div>
          <div className="right-box">
            {ViewProfileArr[viewComponent].component}
          </div>
        </div>
      </div>
    );
  else
    return (
      <>
        {showAddModal ? (
          <div className="modal">
            <div className="add">
              <h3>Add New Department</h3>
              <form onSubmit={(e) => handleAdd(e)}>
                <input
                  onChange={(e) => setData({ name: e.target.value })}
                  type="text"
                  placeholder="Enter Department Name"
                />
                <div className="btns">
                  <input
                    type="button"
                    value="Cancel"
                    onClick={() => setShowAddModal(false)}
                  />
                  <input type="submit" value="Add" />
                </div>
              </form>
            </div>
          </div>
        ) : null}
        {table.isShow ? (
          loader ? (
            <Loader size={50} fullHeight={true} fullWidth={true} />
          ) : (
            <div className="departments">
              <div className="top">
                <button
                  onClick={() => {
                    setTable({ isShow: false, data: [] });
                    setPage(1);
                    setMaxPage("");
                    setItemsPerPage(10);
                  }}
                >
                  <FaArrowLeft />
                  <h3>Back</h3>
                </button>
              </div>
              <div className="bottom">
                <table>
                  <thead>
                    <tr>
                      <td>Employee Name</td>
                      <td>Employee ID</td>
                      <td>Department</td>
                      <td>Designation</td>
                      <td>Location</td>
                      <td>Type</td>
                    </tr>
                  </thead>
                  <tbody>
                    {table.data
                      ?.sort((a, b) => a.empId.localeCompare(b.empId)) //sorting
                      .slice((page - 1) * itemsPerPage, page * itemsPerPage) //pagination
                      .map((emp, key) => (
                        <tr key={key}>
                          <td data-id={"Employee Name"}>
                            <div className="table-box">
                              <img src={emp.profile} alt="" />
                              <h3>{emp.name}</h3>
                            </div>
                          </td>
                          <td data-id={"Employee ID"}>
                            <h3>{emp.empId}</h3>
                          </td>
                          <td data-id={"Department"}>
                            <h3>{emp.department}</h3>
                          </td>
                          <td data-id={"Designation"}>
                            <h3>{emp.designation}</h3>
                          </td>
                          <td data-id={"Location"}>
                            <h3>{emp.office_location}</h3>
                          </td>
                          <td data-id={"Type"} className="color-td">
                            <h3>{emp.emp_type}</h3>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="pagination">
                  <div className="item-count">
                    <h3>Showing</h3>
                    <select onChange={(e) => handleChangePageItem(e)}>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="25">25</option>
                    </select>
                  </div>
                  <p>
                    Showing{" "}
                    {(page - 1) * itemsPerPage + 1 > table.data?.length
                      ? table.data?.length
                      : (page - 1) * itemsPerPage + 1}{" "}
                    to{" "}
                    {page * itemsPerPage > table.data?.length
                      ? table.data?.length
                      : page * itemsPerPage}{" "}
                    out of {table.data?.length} records
                  </p>
                  <div className="paging">
                    {page <= 1 ? null : (
                      <FaAngleRight onClick={() => setPage(page - 1)} />
                    )}
                    <h3>{page}</h3>
                    {page >= maxPage ? null : (
                      <FaAngleRight onClick={() => setPage(page + 1)} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="departments">
            <div className="top">
              <SearchBar onChange={(e) => setText(e.target.value)} />
              <button onClick={() => setShowAddModal(true)}>
                <FaPlusCircle />
                <h3>Add More</h3>
              </button>
            </div>
            {loader || department === null ? (
              <Loader size={50} fullHeight={true} fullWidth={true} />
            ) : (
              <div className="bottom">
                {department.length === 0 ? (
                  <h3 className="empty-text-signal">
                    No Department is added!!
                  </h3>
                ) : (
                  department
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((department, key) => {
                      const empArr = empById[department.id];
                      return (
                        <div className="department" key={key}>
                          <div className="header">
                            <div className="content">
                              <h3>{department?.name}</h3>
                              <h5>{empArr?.length || 0} Members</h5>
                            </div>
                            {empArr?.length > 0 ? (
                              <h3 onClick={() => handleEmpClick(department.id)}>
                                View All
                              </h3>
                            ) : null}
                          </div>
                          <div className="employees">
                            {empArr?.slice(0, 5).map((emp, idx) => (
                              <div
                                onClick={() =>
                                  setViewEmp({
                                    isShow: true,
                                    data: emp,
                                  })
                                }
                                key={idx}
                                className="emp"
                              >
                                <div className="profile-div">
                                  <img src={emp.profile} />
                                  <div className="content-div">
                                    <h3>{emp.name}</h3>
                                    <h5>{emp.designation}</h5>
                                  </div>
                                </div>
                                <FaAngleRight />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            )}
          </div>
        )}
      </>
    );
};

export default Departments;
