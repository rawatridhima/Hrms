import React, { useEffect, useState } from "react";
import "./Display.css";
import { FaBriefcase,  FaUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { MdLock, MdMail, MdOutlineMailOutline, MdOutlineWbSunny } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, MODES, checkIsSingleDataExist } from "../../../Helper/Helper";
import { toggleDark, toggleLight } from "../../../Reducers/Theme";
import { GoMoon } from "react-icons/go";
import { HiOutlineDownload } from "react-icons/hi";
import { IoBagOutline, IoEyeOutline } from "react-icons/io5";

const Display = () => {
  //states
  const auth = useSelector((x) => x.auth);
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const dispatch = useDispatch();
  const theme = useSelector((x) => x.theme);
  const [emp, setEmp] = useState([]);
  const [modalPage, setModalPage] = useState(0);

  //   rendering
  useEffect(() => {
    setEmp(auth.user)
    console.log(emp)
  }, []);

  //SubElements
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
  //   handling methods
  const handleTheme = (ThemeType) => {
    //dark
    if (ThemeType === MODES.DARK) {
      dispatch(toggleDark());
      Object.keys(COLORS.DARK).forEach((x) =>
        document.documentElement.style.setProperty(x, COLORS.DARK[x])
      );
    }
    //light
    else {
      dispatch(toggleLight());
      Object.keys(COLORS.LIGHT).forEach((x) =>
        document.documentElement.style.setProperty(x, COLORS.LIGHT[x])
      );
    }
  };


  return (
    <div className="main">
      <div className={`left ${active ? "show" : ""}`}>
        <div className="head">
          <img src={require("../../../Assests/images/logo.png")} alt="" />
          <h3>HRMS</h3>
        </div>
        <div className="elements">
        {pages.map((page, key) =>
          checkIsSingleDataExist(page.datas(emp), "val") ? (
            <button
              className={key === modalPage ? "active" : ""}
              onClick={() => {
                setModalPage(key);
                setActive((prev) => !prev);
              }}
              key={key}
            >
              <h3>{page.name}</h3>
              {page.icon}
            </button>
          ) : null
        )}
        </div>
        <div className="buttons">
          <button
            onClick={() => handleTheme(MODES.LIGHT)}
            className={theme.mode === MODES.LIGHT ? "active" : ""}
          >
            <MdOutlineWbSunny />
            <h3>Light</h3>
          </button>
          <button
            onClick={() => handleTheme(MODES.DARK)}
            className={theme.mode === MODES.DARK ? "active" : ""}
          >
            <GoMoon />
            <h3>Dark</h3>
          </button>
        </div>
        <button onClick={() => navigate("/")}>Go to dashboard</button>
      </div>
      <div className="right">
          <div className="header">
            <div className="leftside">
              <div className={`menu ${active?'active':''}`} onClick={() => setActive((prev) => !prev)}>
                <div className="b1"></div>
                <div className="b2"></div>
                <div className="b3"></div>
             
              </div>
              <div className="headings">
                <h3>My Profile</h3>
                <h5></h5>
              </div>
            </div>
          </div>
          <div className="box">
          <div className="view">
          <div className="view-top">
          <div className="left">
            <img src={emp.profile || require('../../../Assests/images/profile.png')} alt="" />
            <div className="info">
              <h3>{emp.name}</h3>
              <div className="frame">
                <IoBagOutline />
                <h4>{emp.designation}</h4>
              </div>
              <div className="frame">
                <MdOutlineMailOutline />
                <h4>{emp.email}</h4>
              </div>
            </div>
          </div>
         
        </div>
          <div className="bottom-pages">
        <div className="viewData">
          {pages[modalPage].datas(emp).map((x, idx) => {
            if (!x.val) return null;
            if (modalPage === 3)
              return (
                <div key={idx} className="downloadDataContent">
                  <h3>{x.name}</h3>
                  <a href={x.val} target="_blank">
                    <IoEyeOutline />
                  </a>
                </div>
              );
            else if (modalPage === 2)
              return (
                <div key={idx} className="downloadDataContent">
                  <h3>{x.name}</h3>
                  <a href={x.val} target="_blank">
                    <HiOutlineDownload />
                  </a>
                </div>
              );
            else
              return (
                <div key={idx} className="viewDataContent">
                  <h3>{x.name}</h3>
                  <h4>{x.val}</h4>
                </div>
              );
          })}
        </div>
      </div>
          </div>
          </div>
        </div>
    </div>
  );
};

export default Display;
