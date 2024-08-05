import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { logout } from "../../Reducers/AuthReducer";
import { MdOutlineWbSunny } from "react-icons/md";
import { GoMoon } from "react-icons/go";
import { PiUserSwitchDuotone, PiUsersThree } from "react-icons/pi";
import { LuCalendarCheck, LuClipboardList, LuSettings } from "react-icons/lu";
import { AiOutlineBell, AiOutlineDollar } from "react-icons/ai";
import { FaRegCalendarAlt, FaRegUser } from "react-icons/fa";
import { TbUsers } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { TbLayoutDashboard } from "react-icons/tb";
import { SlBriefcase } from "react-icons/sl";
import { IoLogOutOutline } from "react-icons/io5";
import { COLORS, Greetings, MODES, Roles } from "../../Helper/Helper";
import { toggleDark, toggleLight } from "../../Reducers/Theme";
import DashBoardBox from "./DashBoardBox";
import Employes from "./Employes/Employes";
import Attendance from "./Attendance/Attendance";
import Candidates from "./Candidates/Candidates";
import Holidays from "./Holidays/Holidays";
import Job from "./Job/Job";
import Leaves from "./Leaves/Leaves";
import Payroll from "./Payroll/Payroll";
import Setting from "./Setting";
import Departments from "./Departments/Departments";

const Dashboard = () => {
  //states
  const auth = useSelector((x) => x.auth);
  const navigate = useNavigate();
  const [viewOptions, setViewOptions] = useState(false);
  const [active, setActive] = useState(false);
  const dispatch = useDispatch();
  const theme = useSelector((x) => x.theme);
  //rendering
  useEffect(() => {
    if (!auth.isAuth) navigate("/auth");
    // console.log(auth.user);
  }, []);
  const [component, setComponent] = useState(0);
  //handling Fucntions
  const handleLogOut = () => {
    dispatch(logout());
    navigate("/auth");
  };
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
  //SubElements
  const menus = [
    {
      name: "Dashboard",
      icon: <TbLayoutDashboard />,
      component: <DashBoardBox x={setComponent} />,
      heading: [`Hello ${auth.user?.name || "Admin"} 👋🏻`, Greetings()],
      role: [Roles.USER, Roles.SUPER_ADMIN, Roles.ADMIN],
    },
    {
      name: "All Employees",
      icon: <PiUsersThree />,
      component: <Employes />,
      heading: [`All Employees`, `All Employee Information`],
      role: [Roles.SUPER_ADMIN, Roles.ADMIN],
    },
    {
      name: "All Departments",
      icon: <PiUserSwitchDuotone />,
      component: <Departments />,
      heading: [`All Departments`, `All Departments Information`],
      role: [Roles.SUPER_ADMIN, Roles.ADMIN],
    },
    {
      name: "Attendance",
      icon: <LuCalendarCheck />,
      component: <Attendance />,
      heading: [`Attendance`, `All Employee Attendance`],
      role: [Roles.USER, Roles.SUPER_ADMIN, Roles.ADMIN],
    },
    {
      name: "Payroll",
      icon: <AiOutlineDollar />,
      component: <Payroll />,
      heading: [`Payroll`, `All Employee Payroll`],
      role: [Roles.USER, Roles.SUPER_ADMIN, Roles.ADMIN],
    },
    {
      name: "Jobs",
      icon: <SlBriefcase />,
      component: <Job />,
      heading: [`Jobs`, `Show All Jobs`],
      role: [Roles.SUPER_ADMIN, Roles.ADMIN],
    },
    {
      name: "Candidates",
      icon: <TbUsers />,
      component: <Candidates />,
      heading: [`Candidates`, `Show All Candidates`],
      role: [Roles.SUPER_ADMIN, Roles.ADMIN],
    },
    {
      name: "Leaves",
      icon: <LuClipboardList />,
      component: <Leaves />,
      heading: [`Leaves`, `View All Leaves`],
      role: [Roles.USER, Roles.SUPER_ADMIN, Roles.ADMIN],
    },
    {
      name: "Holidays",
      icon: <FaRegCalendarAlt />,
      component: <Holidays />,
      heading: [`Holidays`, `All Holidays List`],
      role: [Roles.USER, Roles.SUPER_ADMIN, Roles.ADMIN],
    },
    {
      name: "Settings",
      icon: <LuSettings />,
      component: <Setting handleTheme={handleTheme} />,
      heading: [`Settings`, `All System Settings`],
      role: [Roles.USER, Roles.SUPER_ADMIN, Roles.ADMIN],
    },
  ];

  return (
    <>
      <div className="main">
        <div className={`left ${active ? "show" : ""}`}>
          <div className="head">
            <img src={require("../../Assests/images/logo.png")} alt="" />
            <h3>HRMS</h3>
          </div>
          <div className="elements">
            {menus.map((obj, i) => {
              if (obj.role.includes(auth.user?.role))
                return (
                  <button
                    i={i}
                    className={i === component ? "active" : ""}
                    onClick={() => {
                      setComponent(i);
                      setActive((prev) => !prev);
                    }}
                  >
                    {obj.icon}
                    <h5>{obj.name}</h5>
                  </button>
                );
              else return null;
            })}
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
        </div>
        <div className="right">
          <div className="header">
            <div className="leftside">
              <div
                className={`menu ${active ? "active" : ""}`}
                onClick={() => setActive((prev) => !prev)}
              >
                <div className="b1"></div>
                <div className="b2"></div>
                <div className="b3"></div>
              </div>
              <div className="headings">
                <h3>{menus[component].heading[0]} </h3>
                <h5>{menus[component].heading[1]}</h5>
              </div>
            </div>
            <div className="rightside">
              <div className="inp">
                <FaSearch className="icon" />
                <input type="text" placeholder="Search" />
              </div>
              <div className="notification">
                <AiOutlineBell className="icon" />
              </div>
              <div onClick={() => setViewOptions(true)} className="profile">
                <div className="pic">
                  <img
                    src={
                      auth.user?.profile ||
                      require("../../Assests/images/profile.png")
                    }
                    alt=""
                  />
                </div>
                <div className="info">
                  <h4>{auth.user?.name} </h4>
                  <h5>{auth.user?.department || "Admin"}</h5>
                </div>
                <div className="arrow">
                  <IoIosArrowDown className="icon" />
                </div>
              </div>
            </div>
          </div>
          <div className="box">
            {menus.map((x, i) => {
              if (i === component) return x.component;
            })}
          </div>
        </div>
      </div>
      {viewOptions ? (
        <>
          <div
            onClick={() => setViewOptions(false)}
            className="container"
          ></div>
          <div className="options">
            <div className="option" onClick={() => navigate("/profile")}>
              <FaRegUser />
              <h3>My Profile</h3>
            </div>
            <div onClick={handleLogOut} className="option">
              <IoLogOutOutline />
              <h3>Logout</h3>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Dashboard;
