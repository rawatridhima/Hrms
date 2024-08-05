import React, { useEffect, useMemo, useState } from "react";
import "./Employes.css";
import SearchBar from "../../../Helper/SearchBar/SearchBar";
import {
  FaAngleLeft,
  FaAngleRight,
  FaBriefcase,
  FaCamera,
  FaClipboardList,
  FaEye,
  FaPlusCircle,
  FaProjectDiagram,
  FaRProject,
  FaRegCalendarCheck,
  FaTrashAlt,
  FaUser,
} from "react-icons/fa";
import { VscSettings } from "react-icons/vsc";
import { FaCloudArrowUp, FaPencil } from "react-icons/fa6";
import { MdMail, MdOutlineClear } from "react-icons/md";
import { MdLock } from "react-icons/md";
import toast from "react-hot-toast";
import Loader from "../../Loader/Loader";
import DepartmentService from "../../../Services/DepartmentService";
import EmployeeService from "../../../Services/EmployeeService";
import {
  EMPLOYEE_TYPES,
  OFFICE_LOCATIONS,
  validateEmail,
  validateForm,
} from "../../../Helper/Helper";
import DragFiles from "../../../Helper/DragFiles/DragFiles";
import countryList from "react-select-country-list";
import CheckBox from "../../../Helper/CheckBox/CheckBox";
import RadioButton from "../../../Helper/RadioButton/RadioButton";
import { IoBagOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { LuCalendarCheck, LuClipboardList } from "react-icons/lu";
import Profile from "./Profile";
import EmpAttendance from "./EmpAttendance";
import EmpLeave from "./EmpLeave";

const Employes = () => {
  //states
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState("");
  const [department, setDepartment] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterData, setFilterData] = useState({
    searchEmpText: "",
    empDepArr: [],
    empTypeArr: [],
  });
  const [loader, setLoader] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalPage, setModalPage] = useState(0);
  const [data, setData] = useState("");
  const countryOptions = useMemo(() => countryList().getData(), []);
  const [viewEmployees, setViewEmployees] = useState(false);
  const [viewComponent, setViewComponent] = useState(0);
  const [id,setId]=useState("")

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
      icon: <MdLock />,
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
  const viewArray = [
    {
      name: "Profile",
      icon: <FaUser />,
      component: <Profile pages={pages} emp={selectedEmployee} />,
    },
    {
      name: "Attendance",
      icon: <LuCalendarCheck/>,
      component: <EmpAttendance  userId={selectedEmployee.id}  />,
    },
   
    {
      name: "Leave",
      icon: <LuClipboardList />,
      component: <EmpLeave userId={selectedEmployee.id} />,
    },
  ];

  // handling fuctions
  const handleAddBtnClick = () => {
    if (department || department.length > 0) {
      setShowAddModal(true);
    } else {
      toast.error("Add a department first!");
    }
  };
  const handleFilterClick = () => {
    setShowFilterModal(true);
  };
  const handleClearFilters = () => {
    setFilterData({
      searchEmpText: "",
      empDepArr: [],
      empTypeArr: [],
    });
  };
  const handleEditClick = async (emp) => {
    setSelectedEmployee({
      ...emp,
      original_email: emp.email,
      original_user_name: emp.user_name,
      department: await DepartmentService.getDepartmentID(emp.department),
      original_profile: emp.profile,
      original_appointment_letter: emp.appointment_letter,
      original_salary_slips: emp.salary_slips,
      original_reliving_letter: emp.reliving_letter,
      original_experience_letter: emp.experience_letter,
    });
    setShowUpdateModal(true);
  };
  const handleDeleteClick = (emp) => {
    setSelectedEmployee(emp);
    setShowDeleteModal(true);
  };
  const handleChangePageItem = (e) => {
    setPage(1);
    const val = Number(e.target.value);
    setItemsPerPage(val);
    const noOfPages = employees.length / val;
    setMaxPage(
      Math.floor(noOfPages) == noOfPages ? noOfPages : Math.floor(noOfPages) + 1
    );
  };
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setLoader(true);
    // add button
    if (modalPage === pages.length - 1) {
      const res = await EmployeeService.create(data);
      console.log(res);
      toast.success("Employee Added SuccessFully!");
      setData("");
      setShowAddModal(false);
      setModalPage(0);
    }
    // next button
    else {
      const flag1 =
        modalPage === 0 &&
        validateForm(
          data.profile,
          data.first_name,
          data.last_name,
          data.mobile_number,
          data.email,
          data.dob,
          data.marital_status,
          data.gender,
          data.country,
          data.address,
          data.city,
          data.state,
          data.zip_code
        );
      const flag2 =
        modalPage === 1 &&
        validateForm(
          data.empId,
          data.user_name,
          data.emp_type,
          data.department,
          data.designation,
          data.joining_date,
          data.office_location
        );
      if (flag1 || flag2 || modalPage === 2 || modalPage == 3) {
        if (validateEmail(data.email)) {
          if (modalPage === 1) {
            if (!(await EmployeeService.userNameExists(data.user_name))) {
              setModalPage((prev) => prev + 1);
            } else {
              toast.error("Username already exists!");
            }
          } else if (modalPage === 0) {
            if (!(await EmployeeService.checkEmailExists(data.email)))
              setModalPage((prev) => prev + 1);
            else toast.error("Email already exists");
          } else setModalPage((prev) => prev + 1);
        } else {
          toast.error("email must be of type abc@exmaple.com");
        }
      } else {
        toast.error("All fields are mandatory");
      }
    }
    setLoader(false);
  };
  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    console.log(selectedEmployee);
    //Edit Button Logic
    setLoader(true);
    if (modalPage === pages.length - 1) {
      const res = await EmployeeService.update(selectedEmployee.id, {
        ...selectedEmployee,
        original_email: null,
        original_user_name: null,
      });
      console.log(res);
      toast.success("Employee Updated Successfully.");
      setSelectedEmployee("");
      setShowUpdateModal(false);
      setModalPage(0);
    }
    //Next Button Logic
    else {
      const flag1 =
        modalPage === 0 &&
        validateForm(
          selectedEmployee.profile,
          selectedEmployee.first_name,
          selectedEmployee.last_name,
          selectedEmployee.mobile_number,
          selectedEmployee.email,
          selectedEmployee.dob,
          selectedEmployee.marital_status,
          selectedEmployee.gender,
          selectedEmployee.country,
          selectedEmployee.address,
          selectedEmployee.city,
          selectedEmployee.state,
          selectedEmployee.zip_code
        );
      const flag2 =
        modalPage === 1 &&
        validateForm(
          selectedEmployee.empId,
          selectedEmployee.user_name,
          selectedEmployee.emp_type,
          selectedEmployee.department,
          selectedEmployee.designation,
          selectedEmployee.joining_date,
          selectedEmployee.office_location
        );
      if (flag1 || flag2 || modalPage === 2 || modalPage === 3) {
        if (validateEmail(selectedEmployee.email)) {
          if (modalPage === 1) {
            if (
              !(await EmployeeService.userNameExists(
                selectedEmployee.user_name
              )) ||
              selectedEmployee.user_name === selectedEmployee.original_user_name
            )
              setModalPage((prev) => prev + 1);
            else toast.error("Username already exist!!");
          } else if (modalPage === 0) {
            if (
              !(await EmployeeService.checkEmailExists(
                selectedEmployee.email
              )) ||
              selectedEmployee.email === selectedEmployee.original_email
            )
              setModalPage((prev) => prev + 1);
            else toast.error("Email already exist!!");
          } else setModalPage((prev) => prev + 1);
        } else {
          toast.error("email must be like example@example.xyz");
        }
      } else toast.error("All Fields are Mandatory.");
    }
    setLoader(false);
  };
  const deleteEmployee = async (e) => {
    e.preventDefault();
    setLoader(true);
    await EmployeeService.delete([selectedEmployee.id]);
    setLoader(false);
    toast.success(`${selectedEmployee.name}'s records deleted successfully.`);
    setSelectedEmployee("");
    setShowDeleteModal(false);
  };
  const handleFilters = async (e) => {
    e.preventDefault();
    if (
      filterData.searchEmpText !== "" ||
      filterData.empDepArr.length > 0 ||
      filterData.empTypeArr.length > 0
    ) {
      setLoader(true);
      const res = await EmployeeService.filterEmployees(filterData);
      setEmployees(res);
      const perPage = res.length / itemsPerPage;
      setMaxPage(
        Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
      );
      setShowFilterModal(false);
      setPage(1); //first page
      setLoader(false);
    } else toast.error("Atleast choose one filter to apply changes.");
  };
  const getDepartments = async () => {
    setLoader(true);
    const res = await DepartmentService.read();
    if (res) {
      setDepartment(Object.values(res));
    }
    setLoader(false);
  };
  const getEmpID = async () => {
    setLoader(true);
    setData({ ...data, empId: `#EMP-${await EmployeeService.getNewEmpId()}` });
    setLoader(false);
  };
  const getEmployees = async () => {
    setLoader(true);
    const val = await EmployeeService.getAllEmployees();
    setEmployees(val);
    const perPage = val.length / itemsPerPage;
    setMaxPage(
      Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
    );
    setPage(1); //first page
    setLoader(false);
  };
  const handleChange = async () => {
    setPage(1);
    setLoader(true);
    const val = await EmployeeService.getAllEmployees();
    const updatedVal = [];
    val.forEach((x) => {
      if (x.name.toLowerCase().includes(search.toLowerCase()))
        updatedVal.push(x);
    });
    const perPage = updatedVal.length / itemsPerPage;
    setMaxPage(
      Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
    );
    setEmployees(updatedVal);
    setLoader(false);
  };
  const handleViewClick = (emp) => {
    setSelectedEmployee(emp);
    setViewEmployees(true);
  };
 

  // Rendering
  useEffect(() => {
    if (!showAddModal && !showDeleteModal) {
      if (search.length > 0) {
        const timer = setTimeout(() => {
          handleChange();
        }, 500);
        return () => clearTimeout(timer);
      } else getEmployees();
    }
  }, [showAddModal, showDeleteModal, showUpdateModal, search]);
  useEffect(() => {
    getDepartments();
    getEmpID();
  }, [showAddModal]);
useState(()=>{
  console.log(selectedEmployee)
},[])


  if (showAddModal)
    return (
      <div className="modal emp">
        <div className="add">
          <h3>Add New Employee</h3>
          <div className="pages">
            {pages.map((page, key) => (
              <button className={key === modalPage ? "active" : ""} key={key}>
                <h3>{page.name}</h3>
                {page.icon}
              </button>
            ))}
          </div>
          {
            <form onSubmit={(e) => handleAddEmployee(e)}>
              {(() => {
                if (loader || department === "")
                  return (
                    <Loader size={50} fullHeight={true} fullWidth={true} />
                  );
                if (modalPage <= 0)
                  return (
                    <>
                      <DragFiles
                        className={"drag"}
                        acceptedFiles={["jpg", "png", "jpeg"]}
                        onChange={(file) => setData({ ...data, profile: file })}
                        value={data.profile}
                      >
                        <FaCamera />
                      </DragFiles>
                      <input
                        onChange={(e) =>
                          setData({ ...data, first_name: e.target.value })
                        }
                        value={data.first_name}
                        type="text"
                        placeholder="First Name"
                      />
                      <input
                        onChange={(e) =>
                          setData({ ...data, last_name: e.target.value })
                        }
                        type="text"
                        placeholder="Last Name"
                        value={data.last_name}
                      />
                      <input
                        onChange={(e) =>
                          setData({ ...data, mobile_number: e.target.value })
                        }
                        value={data.mobile_number}
                        type="tel"
                        placeholder="Mobile Number"
                      />
                      <input
                        onChange={(e) =>
                          setData({ ...data, email: e.target.value })
                        }
                        value={data.email}
                        type="email"
                        placeholder="Email Address"
                      />
                      <input
                        type="text"
                        placeholder="Date of Birth"
                        value={data.dob}
                        onFocus={(e) => {
                          e.target.type = "date";
                        }}
                        onBlur={(e) => {
                          if (e.target.value == "") e.target.type = "text";
                        }}
                        onChange={(e) =>
                          setData({ ...data, dob: e.target.value })
                        }
                      />
                      <select
                        className={data.marital_status ? "" : "placeholder"}
                        onChange={(e) => {
                          if (e.target.value === "-1")
                            e.target.classList.add("placeholder");
                          else e.target.classList.remove("placeholder");
                          setData({ ...data, marital_status: e.target.value });
                        }}
                      >
                        <option
                          selected={data.marital_status == "-1" ? true : false}
                          value={-1}
                        >
                          Marital Status
                        </option>
                        <option
                          selected={
                            data.marital_status == "Married" ? true : false
                          }
                          value="Married"
                        >
                          Married
                        </option>
                        <option
                          selected={
                            data.marital_status == "Unmarried" ? true : false
                          }
                          value="Unmarried"
                        >
                          Unmarried
                        </option>
                      </select>
                      <select
                        className={data.gender ? "" : "placeholder"}
                        onChange={(e) => {
                          if (e.target.value === "-1")
                            e.target.classList.add("placeholder");
                          else e.target.classList.remove("placeholder");
                          setData({ ...data, gender: e.target.value });
                        }}
                      >
                        <option
                          selected={data.gender == "-1" ? true : false}
                          value={-1}
                        >
                          Gender
                        </option>
                        <option
                          selected={data.gender == "Male" ? true : false}
                          value="Male"
                        >
                          Male
                        </option>
                        <option
                          selected={data.gender == "Female" ? true : false}
                          value="Female"
                        >
                          Female
                        </option>
                        <option
                          selected={data.gender == "Other" ? true : false}
                          value="Other"
                        >
                          Other
                        </option>
                      </select>
                      <select
                        className={data.country ? "" : "placeholder"}
                        onChange={(e) => {
                          if (e.target.value === "-1")
                            e.target.classList.add("placeholder");
                          else e.target.classList.remove("placeholder");
                          setData({ ...data, country: e.target.value });
                        }}
                      >
                        <option
                          selected={data.country == "-1" ? true : false}
                          value={-1}
                        >
                          Country
                        </option>
                        {countryOptions.map((country, key) => (
                          <option
                            selected={
                              data.country == country.label ? true : false
                            }
                            key={key}
                            value={country.label}
                          >
                            {country.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        className="full-input"
                        placeholder="Address"
                        value={data.address}
                        onChange={(e) =>
                          setData({ ...data, address: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        className="one-third-input"
                        placeholder="City"
                        value={data.city}
                        onChange={(e) =>
                          setData({ ...data, city: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        className="one-third-input"
                        placeholder="State"
                        value={data.state}
                        onChange={(e) =>
                          setData({ ...data, state: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        className="one-third-input"
                        placeholder="Zip Code"
                        value={data.zip_code}
                        onChange={(e) =>
                          setData({ ...data, zip_code: e.target.value })
                        }
                      />
                    </>
                  );
                else if (modalPage === 1)
                  return (
                    <>
                      <input
                        value={data.empId}
                        readOnly
                        type="text"
                        placeholder="Employee ID"
                        style={{ backgroundColor: "var(--pannelHoverColor)" }}
                      />
                      <input
                        type="text"
                        placeholder="User Name"
                        value={data.user_name}
                        onChange={(e) =>
                          setData({
                            ...data,
                            user_name: e.target.value,
                          })
                        }
                      />
                      <select
                        className={data.emp_type ? "" : "placeholder"}
                        onChange={(e) => {
                          if (e.target.value === "-1")
                            e.target.classList.add("placeholder");
                          else e.target.classList.remove("placeholder");
                          setData({ ...data, emp_type: e.target.value });
                        }}
                      >
                        <option
                          selected={data.emp_type == "-1" ? true : false}
                          value={-1}
                        >
                          Select Employee Type
                        </option>
                        {Object.keys(EMPLOYEE_TYPES).map((type, key) => (
                          <option
                            selected={
                              data.emp_type == EMPLOYEE_TYPES[type]
                                ? true
                                : false
                            }
                            key={key}
                            value={EMPLOYEE_TYPES[type]}
                          >
                            {EMPLOYEE_TYPES[type]}
                          </option>
                        ))}
                      </select>
                      <select
                        className={data.department ? "" : "placeholder"}
                        onChange={(e) => {
                          if (e.target.value === "-1")
                            e.target.classList.add("placeholder");
                          else e.target.classList.remove("placeholder");
                          setData({ ...data, department: e.target.value });
                        }}
                      >
                        <option
                          selected={data.department == "-1" ? true : false}
                          value={-1}
                        >
                          Select Department
                        </option>
                        {department.map((dep, key) => (
                          <option
                            selected={data.department == dep.id ? true : false}
                            key={key}
                            value={dep.id}
                          >
                            {dep.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={data.designation}
                        onChange={(e) =>
                          setData({
                            ...data,
                            designation: e.target.value,
                          })
                        }
                        placeholder="Enter Designation"
                      />
                      <input
                        type="text"
                        placeholder="Select Joining Date"
                        value={data.joining_date}
                        onChange={(e) =>
                          setData({
                            ...data,
                            joining_date: e.target.value,
                          })
                        }
                        onFocus={(e) => {
                          e.target.type = "date";
                        }}
                        onBlur={(e) => {
                          if (e.target.value == "") e.target.type = "text";
                        }}
                      />
                            <input
                        type="Number"
                        value={data.ctc}
                        onChange={(e) =>
                          setData({
                            ...data,
                            ctc: e.target.value,
                          })
                        }
                        placeholder="Enter CTC"
                      />
                      <select
                        className={`${
                          data.office_location ? "" : "placeholder"
                        } `}
                        onChange={(e) => {
                          if (e.target.value === "-1")
                            e.target.classList.add("placeholder");
                          else e.target.classList.remove("placeholder");
                          setData({ ...data, office_location: e.target.value });
                        }}
                      >
                        <option
                          selected={data.office_location == "-1" ? true : false}
                          value={-1}
                        >
                          Select Office Location
                        </option>
                        {Object.keys(OFFICE_LOCATIONS).map((location, key) => (
                          <option
                            selected={
                              data.office_location == OFFICE_LOCATIONS[location]
                                ? true
                                : false
                            }
                            key={key}
                            value={OFFICE_LOCATIONS[location]}
                          >
                            {OFFICE_LOCATIONS[location]}
                          </option>
                        ))}
                      </select>
                    </>
                  );
                else if (modalPage === 2)
                  return (
                    <>
                      <div className="upload">
                        <h3>Upload Appointment Letter</h3>
                        <DragFiles
                          className={"fileDrag"}
                          acceptedFiles={["jpg", "png", "jpeg", "pdf"]}
                          onChange={(file) =>
                            setData({ ...data, appointment_letter: file })
                          }
                          value={data.appointment_letter}
                        >
                          <div className="icon">
                            <FaCloudArrowUp />
                          </div>
                          <h3>
                            Drag & Drop or <span>choose file</span> to upload
                          </h3>
                          <h5>Supported formats : Jpg, Png, Jpeg, pdf</h5>
                        </DragFiles>
                      </div>
                      <div className="upload">
                        <h3>Upload Salary Slips</h3>
                        <DragFiles
                          className={"fileDrag"}
                          acceptedFiles={["jpg", "png", "jpeg", "pdf"]}
                          onChange={(file) =>
                            setData({ ...data, salary_slips: file })
                          }
                          value={data.salary_slips}
                        >
                          <div className="icon">
                            <FaCloudArrowUp />
                          </div>
                          <h3>
                            Drag & Drop or <span>choose file</span> to upload
                          </h3>
                          <h5>Supported formats : Jpg, Png, Jpeg, pdf</h5>
                        </DragFiles>
                      </div>
                      <div className="upload">
                        <h3>Upload Reliving Letter</h3>
                        <DragFiles
                          className={"fileDrag"}
                          acceptedFiles={["jpg", "png", "jpeg", "pdf"]}
                          onChange={(file) =>
                            setData({ ...data, reliving_letter: file })
                          }
                          value={data.reliving_letter}
                        >
                          <div className="icon">
                            <FaCloudArrowUp />
                          </div>
                          <h3>
                            Drag & Drop or <span>choose file</span> to upload
                          </h3>
                          <h5>Supported formats : Jpg, Png, Jpeg, pdf</h5>
                        </DragFiles>
                      </div>
                      <div className="upload">
                        <h3>Upload Experience Letter</h3>
                        <DragFiles
                          className={"fileDrag"}
                          acceptedFiles={["jpg", "png", "jpeg", "pdf"]}
                          onChange={(file) =>
                            setData({ ...data, experience_letter: file })
                          }
                          value={data.experience_letter}
                        >
                          <div className="icon">
                            <FaCloudArrowUp />
                          </div>
                          <h3>
                            Drag & Drop or <span>choose file</span> to upload
                          </h3>
                          <h5>Supported formats : Jpg, Png, Jpeg, pdf</h5>
                        </DragFiles>
                      </div>
                    </>
                  );
                else if (modalPage >= 3)
                  return (
                    <>
                      <input
                        type="text"
                        value={data.linkedin_url}
                        onChange={(e) =>
                          setData({
                            ...data,
                            linkedin_url: e.target.value,
                          })
                        }
                        placeholder="Enter Linkedin ID"
                      />
                      <input
                        type="text"
                        value={data.slack_url}
                        onChange={(e) =>
                          setData({
                            ...data,
                            slack_url: e.target.value,
                          })
                        }
                        placeholder="Enter Slack ID"
                      />
                      <input
                        type="text"
                        value={data.skype_url}
                        onChange={(e) =>
                          setData({
                            ...data,
                            skype_url: e.target.value,
                          })
                        }
                        placeholder="Enter Skype ID"
                      />
                      <input
                        type="text"
                        value={data.github_url}
                        onChange={(e) =>
                          setData({
                            ...data,
                            github_url: e.target.value,
                          })
                        }
                        placeholder="Enter Github ID"
                      />
                    </>
                  );
              })()}
              {loader || department === "" ? null : (
                <div className="btns">
                  {modalPage > 0 ? (
                    <input
                      type="button"
                      onClick={() => setModalPage((prev) => prev - 1)}
                      value="Back"
                    />
                  ) : null}
                  <div className="btns">
                    <input
                      type="button"
                      value="Cancel"
                      onClick={() => {
                        setShowAddModal(false);
                        setData("");
                        setModalPage(0);
                      }}
                    />
                    <input
                      type="submit"
                      value={modalPage < pages.length - 1 ? "Next" : "Add"}
                    />
                  </div>
                </div>
              )}
            </form>
          }
        </div>
      </div>
    );
  else if (showUpdateModal && selectedEmployee)
    return (
      <>
        <div className="modal emp">
          <div className="add">
            <h3>Edit Employee</h3>
            <div className="pages">
              {pages.map((page, key) => (
                <button className={key === modalPage ? "active" : ""} key={key}>
                  <h3>{page.name}</h3>
                  {page.icon}
                </button>
              ))}
            </div>
            {
              <form onSubmit={(e) => handleUpdateEmployee(e)}>
                {(() => {
                  if (loader || department === "")
                    return (
                      <Loader size={50} fullHeight={true} fullWidth={true} />
                    );
                  if (modalPage <= 0)
                    return (
                      <>
                        <DragFiles
                          className={"drag"}
                          acceptedFiles={["jpg", "png", "jpeg"]}
                          onChange={(file) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              profile: file,
                            })
                          }
                          value={selectedEmployee.profile}
                        >
                          <FaCamera />
                        </DragFiles>
                        <input
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              first_name: e.target.value,
                            })
                          }
                          value={selectedEmployee.first_name}
                          type="text"
                          placeholder="First Name"
                        />
                        <input
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              last_name: e.target.value,
                            })
                          }
                          type="text"
                          placeholder="Last Name"
                          value={selectedEmployee.last_name}
                        />
                        <input
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              mobile_number: e.target.value,
                            })
                          }
                          value={selectedEmployee.mobile_number}
                          type="tel"
                          placeholder="Mobile Number"
                        />
                        <input
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              email: e.target.value,
                            })
                          }
                          value={selectedEmployee.email}
                          type="email"
                          placeholder="Email Address"
                        />
                        <input
                          type="text"
                          placeholder="Date of Birth"
                          value={selectedEmployee.dob}
                          onFocus={(e) => {
                            e.target.type = "date";
                          }}
                          onBlur={(e) => {
                            if (e.target.value == "") e.target.type = "text";
                          }}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              dob: e.target.value,
                            })
                          }
                        />
                        <select
                          className={
                            selectedEmployee.marital_status ? "" : "placeholder"
                          }
                          onChange={(e) => {
                            if (e.target.value === "-1")
                              e.target.classList.add("placeholder");
                            else e.target.classList.remove("placeholder");
                            setSelectedEmployee({
                              ...selectedEmployee,
                              marital_status: e.target.value,
                            });
                          }}
                        >
                          <option
                            selected={
                              selectedEmployee.marital_status == "-1"
                                ? true
                                : false
                            }
                            value={-1}
                          >
                            Marital Status
                          </option>
                          <option
                            selected={
                              selectedEmployee.marital_status == "Married"
                                ? true
                                : false
                            }
                            value="Married"
                          >
                            Married
                          </option>
                          <option
                            selected={
                              selectedEmployee.marital_status == "Unmarried"
                                ? true
                                : false
                            }
                            value="Unmarried"
                          >
                            Unmarried
                          </option>
                        </select>
                        <select
                          className={
                            selectedEmployee.gender ? "" : "placeholder"
                          }
                          onChange={(e) => {
                            if (e.target.value === "-1")
                              e.target.classList.add("placeholder");
                            else e.target.classList.remove("placeholder");
                            setSelectedEmployee({
                              ...selectedEmployee,
                              gender: e.target.value,
                            });
                          }}
                        >
                          <option
                            selected={
                              selectedEmployee.gender == "-1" ? true : false
                            }
                            value={-1}
                          >
                            Gender
                          </option>
                          <option
                            selected={
                              selectedEmployee.gender == "Male" ? true : false
                            }
                            value="Male"
                          >
                            Male
                          </option>
                          <option
                            selected={
                              selectedEmployee.gender == "Female" ? true : false
                            }
                            value="Female"
                          >
                            Female
                          </option>
                          <option
                            selected={
                              selectedEmployee.gender == "Other" ? true : false
                            }
                            value="Other"
                          >
                            Other
                          </option>
                        </select>
                        <select
                          className={
                            selectedEmployee.country ? "" : "placeholder"
                          }
                          onChange={(e) => {
                            if (e.target.value === "-1")
                              e.target.classList.add("placeholder");
                            else e.target.classList.remove("placeholder");
                            setSelectedEmployee({
                              ...selectedEmployee,
                              country: e.target.value,
                            });
                          }}
                        >
                          <option
                            selected={
                              selectedEmployee.country == "-1" ? true : false
                            }
                            value={-1}
                          >
                            Country
                          </option>
                          {countryOptions.map((country, key) => (
                            <option
                              selected={
                                selectedEmployee.country == country.label
                                  ? true
                                  : false
                              }
                              key={key}
                              value={country.label}
                            >
                              {country.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          className="full-input"
                          placeholder="Address"
                          value={selectedEmployee.address}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              address: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          className="one-third-input"
                          placeholder="City"
                          value={selectedEmployee.city}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              city: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          className="one-third-input"
                          placeholder="State"
                          value={selectedEmployee.state}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              state: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          className="one-third-input"
                          placeholder="Zip Code"
                          value={selectedEmployee.zip_code}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              zip_code: e.target.value,
                            })
                          }
                        />
                      </>
                    );
                  else if (modalPage === 1)
                    return (
                      <>
                        <input
                          value={selectedEmployee.empId}
                          readOnly
                          type="text"
                          placeholder="Employee ID"
                          style={{ backgroundColor: "var(--pannelHoverColor)" }}
                        />
                        <input
                          type="text"
                          placeholder="User Name"
                          value={selectedEmployee.user_name}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              user_name: e.target.value,
                            })
                          }
                        />
                        <select
                          className={
                            selectedEmployee.emp_type ? "" : "placeholder"
                          }
                          onChange={(e) => {
                            if (e.target.value === "-1")
                              e.target.classList.add("placeholder");
                            else e.target.classList.remove("placeholder");
                            setSelectedEmployee({
                              ...selectedEmployee,
                              emp_type: e.target.value,
                            });
                          }}
                        >
                          <option
                            selected={
                              selectedEmployee.emp_type == "-1" ? true : false
                            }
                            value={-1}
                          >
                            Select Employee Type
                          </option>
                          {Object.keys(EMPLOYEE_TYPES).map((type, key) => (
                            <option
                              selected={
                                selectedEmployee.emp_type ==
                                EMPLOYEE_TYPES[type]
                                  ? true
                                  : false
                              }
                              key={key}
                              value={EMPLOYEE_TYPES[type]}
                            >
                              {EMPLOYEE_TYPES[type]}
                            </option>
                          ))}
                        </select>
                        <select
                          className={
                            selectedEmployee.department ? "" : "placeholder"
                          }
                          onChange={(e) => {
                            if (e.target.value === "-1")
                              e.target.classList.add("placeholder");
                            else e.target.classList.remove("placeholder");
                            setSelectedEmployee({
                              ...selectedEmployee,
                              department: e.target.value,
                            });
                          }}
                        >
                          <option
                            selected={
                              selectedEmployee.department == "-1" ? true : false
                            }
                            value={-1}
                          >
                            Select Department
                          </option>
                          {department.map((dep, key) => (
                            <option
                              selected={
                                selectedEmployee.department == dep.id
                                  ? true
                                  : false
                              }
                              key={key}
                              value={dep.id}
                            >
                              {dep.name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={selectedEmployee.designation}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              designation: e.target.value,
                            })
                          }
                          placeholder="Enter Designation"
                        />
                        <input
                          type="text"
                          placeholder="Select Joining Date"
                          value={selectedEmployee.joining_date}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              joining_date: e.target.value,
                            })
                          }
                          onFocus={(e) => {
                            e.target.type = "date";
                          }}
                          onBlur={(e) => {
                            if (e.target.value == "") e.target.type = "text";
                          }}
                        />
                        <select
                          className={`${
                            selectedEmployee.office_location
                              ? ""
                              : "placeholder"
                          } full-input`}
                          onChange={(e) => {
                            if (e.target.value === "-1")
                              e.target.classList.add("placeholder");
                            else e.target.classList.remove("placeholder");
                            setSelectedEmployee({
                              ...selectedEmployee,
                              office_location: e.target.value,
                            });
                          }}
                        >
                          <option
                            selected={
                              selectedEmployee.office_location == "-1"
                                ? true
                                : false
                            }
                            value={-1}
                          >
                            Select Office Location
                          </option>
                          {Object.keys(OFFICE_LOCATIONS).map(
                            (location, key) => (
                              <option
                                selected={
                                  selectedEmployee.office_location ==
                                  OFFICE_LOCATIONS[location]
                                    ? true
                                    : false
                                }
                                key={key}
                                value={OFFICE_LOCATIONS[location]}
                              >
                                {OFFICE_LOCATIONS[location]}
                              </option>
                            )
                          )}
                        </select>
                      </>
                    );
                  else if (modalPage === 2)
                    return (
                      <>
                        <div className="upload">
                          <h3>Upload Appointment Letter</h3>
                          <DragFiles
                            className={"fileDrag"}
                            acceptedFiles={["jpg", "png", "jpeg", "pdf"]}
                            onChange={(file) =>
                              setSelectedEmployee({
                                ...selectedEmployee,
                                appointment_letter: file,
                              })
                            }
                            value={selectedEmployee.appointment_letter}
                          >
                            <div className="icon">
                              <FaCloudArrowUp />
                            </div>
                            <h3>
                              Drag & Drop or <span>choose file</span> to upload
                            </h3>
                            <h5>Supported formats : Jpg, Png, Jpeg, pdf</h5>
                          </DragFiles>
                        </div>
                        <div className="upload">
                          <h3>Upload Salary Slips</h3>
                          <DragFiles
                            className={"fileDrag"}
                            acceptedFiles={["jpg", "png", "jpeg", "pdf"]}
                            onChange={(file) =>
                              setSelectedEmployee({
                                ...selectedEmployee,
                                salary_slips: file,
                              })
                            }
                            value={selectedEmployee.salary_slips}
                          >
                            <div className="icon">
                              <FaCloudArrowUp />
                            </div>
                            <h3>
                              Drag & Drop or <span>choose file</span> to upload
                            </h3>
                            <h5>Supported formats : Jpg, Png, Jpeg, pdf</h5>
                          </DragFiles>
                        </div>
                        <div className="upload">
                          <h3>Upload Reliving Letter</h3>
                          <DragFiles
                            className={"fileDrag"}
                            acceptedFiles={["jpg", "png", "jpeg", "pdf"]}
                            onChange={(file) =>
                              setSelectedEmployee({
                                ...selectedEmployee,
                                reliving_letter: file,
                              })
                            }
                            value={selectedEmployee.reliving_letter}
                          >
                            <div className="icon">
                              <FaCloudArrowUp />
                            </div>
                            <h3>
                              Drag & Drop or <span>choose file</span> to upload
                            </h3>
                            <h5>Supported formats : Jpg, Png, Jpeg, pdf</h5>
                          </DragFiles>
                        </div>
                        <div className="upload">
                          <h3>Upload Experience Letter</h3>
                          <DragFiles
                            className={"fileDrag"}
                            acceptedFiles={["jpg", "png", "jpeg", "pdf"]}
                            onChange={(file) =>
                              setSelectedEmployee({
                                ...selectedEmployee,
                                experience_letter: file,
                              })
                            }
                            value={selectedEmployee.experience_letter}
                          >
                            <div className="icon">
                              <FaCloudArrowUp />
                            </div>
                            <h3>
                              Drag & Drop or <span>choose file</span> to upload
                            </h3>
                            <h5>Supported formats : Jpg, Png, Jpeg, pdf</h5>
                          </DragFiles>
                        </div>
                      </>
                    );
                  else if (modalPage >= 3)
                    return (
                      <>
                        <input
                          type="text"
                          value={selectedEmployee.linkedin_url}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              linkedin_url: e.target.value,
                            })
                          }
                          placeholder="Enter Linkedin ID"
                        />
                        <input
                          type="text"
                          value={selectedEmployee.slack_url}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              slack_url: e.target.value,
                            })
                          }
                          placeholder="Enter Slack ID"
                        />
                        <input
                          type="text"
                          value={selectedEmployee.skype_url}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              skype_url: e.target.value,
                            })
                          }
                          placeholder="Enter Skype ID"
                        />
                        <input
                          type="text"
                          value={selectedEmployee.github_url}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              github_url: e.target.value,
                            })
                          }
                          placeholder="Enter Github ID"
                        />
                      </>
                    );
                })()}
                {loader || department === "" ? null : (
                  <div className="btns">
                    {modalPage > 0 ? (
                      <input
                        type="button"
                        onClick={() => setModalPage((prev) => prev - 1)}
                        value="Back"
                      />
                    ) : null}
                    <div className="btns">
                      <input
                        type="button"
                        value="Cancel"
                        onClick={() => {
                          setShowUpdateModal(false);
                          setSelectedEmployee("");
                          setFilterData({
                            searchEmpText: "",
                            empDepArr: [],
                            empTypeArr: [],
                          });
                          setModalPage(0);
                          setPage(1);
                        }}
                      />
                      <input
                        type="submit"
                        value={modalPage < pages.length - 1 ? "Next" : "Edit"}
                      />
                    </div>
                  </div>
                )}
              </form>
            }
          </div>
        </div>
      </>
    );
  else if (showDeleteModal && selectedEmployee)
    return (
      <div className="modal">
        <div className="add">
          <h3>Delete Employee Records</h3>
          {loader ? (
            <Loader size={50} />
          ) : (
            <form onSubmit={(e) => deleteEmployee(e)}>
              <p>Do you want to delete the record of {selectedEmployee.name}</p>
              <div className="btns">
                <input
                  type="button"
                  value="Cancel"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedEmployee("");
                    setFilterData({
                      searchEmpText: "",
                      empDepArr: [],
                      empTypeArr: [],
                    });
                  }}
                />
                <input type="submit" value="Delete" />
              </div>
            </form>
          )}
        </div>
      </div>
    );
  else if (showFilterModal)
    return (
      <div className="modal">
        <div className="add">
          <h3>Filter</h3>
          {department === "" || loader ? (
            <Loader size={50} />
          ) : (
            <>
              <SearchBar
                onChange={(e) =>
                  setFilterData({
                    ...filterData,
                    searchEmpText: e.target.value,
                  })
                }
                placeholder="Search Employee"
              />
              <form onSubmit={(e) => handleFilters(e)}>
                <div className="content">
                  <h3>Department</h3>
                  <div className="values">
                    {department.map((dept, key) => (
                      <CheckBox
                        onChange={(val) => {
                          if (val)
                            setFilterData({
                              ...filterData,
                              empDepArr: [...filterData.empDepArr, dept.id],
                            });
                          else
                            setFilterData((prev) => {
                              const arr = prev.empDepArr;
                              arr.splice(arr.indexOf(dept.id), 1);
                              prev.empDepArr = arr;
                              return prev;
                            });
                        }}
                        className="child"
                        text={dept.name}
                        key={key}
                      />
                    ))}
                  </div>
                </div>
                <div className="content">
                  <h3>Select Type</h3>
                  <div className="values">
                    {Object.keys(EMPLOYEE_TYPES).map((type, key) => (
                      <RadioButton
                        onChange={(val) => {
                          if (val)
                            setFilterData({
                              ...filterData,
                              empTypeArr: [
                                ...filterData.empTypeArr,
                                EMPLOYEE_TYPES[type],
                              ],
                            });
                          else
                            setFilterData((prev) => {
                              const arr = prev.empTypeArr;
                              arr.splice(arr.indexOf(EMPLOYEE_TYPES[type]), 1);
                              prev.empTypeArr = arr;
                              return prev;
                            });
                        }}
                        className="child"
                        text={EMPLOYEE_TYPES[type]}
                        key={key}
                      />
                    ))}
                  </div>
                </div>
                <div className="btns">
                  <input
                    type="button"
                    value="Cancel"
                    onClick={() => {
                      setShowFilterModal(false);
                      setFilterData({
                        searchEmpText: "",
                        empDepArr: [],
                        empTypeArr: [],
                      });
                    }}
                  />
                  <input type="submit" value="Apply" />
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    );
  else if (viewEmployees && selectedEmployee)
    return (
      <div className="view">
        <div className="view-top">
          <div className="left">
            <img src={selectedEmployee.profile} alt="" />
            <div className="info">
              <h3>{selectedEmployee.name}</h3>
              <div className="frame">
                <IoBagOutline />
                <h4>{selectedEmployee.designation}</h4>
              </div>
              <div className="frame">
                <MdOutlineMailOutline />
                <h4>{selectedEmployee.email}</h4>
              </div>
            </div>
          </div>
          <div className="right">
            <div
              className="btn"
              onClick={() => {
                setViewEmployees(false);
                handleEditClick(selectedEmployee);
              }}
            >
              <BiEditAlt />
              <h5>Edit Profile</h5>
            </div>
            <div
              className="btn"
              onClick={() => {
                setSelectedEmployee("");
                setViewEmployees(false);
              }}
            >
              <FaEye />
              <h5>View All</h5>
            </div>
          </div>
        </div>
        <div className="view-bottom">
          <div className="left-box">
            {viewArray.map((nav, idx) => (
              <button
                className={idx === viewComponent ? "active" : " "}
                onClick={() => setViewComponent(idx)}
              >
                {nav.icon}
                <h3>{nav.name}</h3>
              </button>
            ))}
          </div>
          <div className="right-box">{viewArray[viewComponent].component}</div>
        </div>
      </div>
    );
  else
    return (
      <div className="Employee">
        {filterData.searchEmpText === "" &&
        filterData.empDepArr.length === 0 &&
        filterData.empTypeArr.length === 0 ? (
          <div className="top">
            <SearchBar
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <div className="btns">
              <button onClick={handleAddBtnClick}>
                <FaPlusCircle />
                <h3>Add More</h3>
              </button>
              <button onClick={handleFilterClick}>
                <VscSettings />
                <h3>Filter</h3>
              </button>
            </div>
          </div>
        ) : (
          <div className="top filter-box">
            <div className="btns">
              <button onClick={handleClearFilters}>
                <MdOutlineClear />
                <h3>Clear Filters</h3>
              </button>
            </div>
          </div>
        )}
        {employees === "" || loader ? (
          <Loader size={50} fullHeight={true} fullWidth={true} />
        ) : employees.length === 0 ? (
          <h3 className="empty-text-signal">No Employee is added!!</h3>
        ) : (
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
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {employees
                  .sort((a, b) => a.empId.localeCompare(b.empId))
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
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
                      <td data-id={"Action"}>
                        <div className="table-box">
                          <FaEye
                            className="icon"
                            onClick={() => {
                              handleViewClick(emp);
                            }}
                          />
                        
                          <FaPencil
                            onClick={() => handleEditClick(emp)}
                            className="icon"
                          />
                          <FaTrashAlt
                            onClick={() =>
                              handleDeleteClick({
                                name: emp.name,
                                id: emp.id,
                              })
                            }
                            className="icon"
                          />
                        </div>
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
                {(page - 1) * itemsPerPage + 1 > employees.length
                  ? employees.length
                  : (page - 1) * itemsPerPage + 1}{" "}
                to{" "}
                {page * itemsPerPage > employees.length
                  ? employees.length
                  : page * itemsPerPage}{" "}
                out of {employees.length} records
              </p>
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

export default Employes;
