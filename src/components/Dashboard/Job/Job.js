import React, { useEffect, useState } from "react";
import SearchBar from "../../../Helper/SearchBar/SearchBar";
import { FaAngleLeft, FaAngleRight, FaPlusCircle } from "react-icons/fa";
import DepartmentService from "../../../Services/DepartmentService";
import { OFFICE_LOCATIONS, normalizeNum } from "../../../Helper/Helper";
import RadioButton from "../../../Helper/RadioButton/RadioButton";
import { set } from "firebase/database";
import JobService from "../../../Services/JobService";
import toast from "react-hot-toast";
import { current } from "@reduxjs/toolkit";
import "./Job.css";
import { useNavigate } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";
import { VscBriefcase } from "react-icons/vsc";
import Loader from "../../Loader/Loader";

const Job = () => {
  // states
  const [search, setSearch] = useState("");
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [data, setData] = useState("");
  const [departments, setDepartments] = useState([]);
  const [checked, setChecked] = useState([]);
  const [loader, setLoader] = useState(false);
  const [activeJob, setActiveJob] = useState([]);
  const [incompleteJob, setIncompleteJob] = useState([]);
  const [completeJob, setCompleteJob] = useState([]);
  const navigate = useNavigate();

  // functions

  const getDepartments = async () => {
    const res = await DepartmentService.read();
    if (res) {
      setDepartments(Object.values(res));
    }
  };
  const handleChange = async () => {
    setLoader(true);
    const updatedVal1 = [];
    const res1 = Object.values((await JobService.getActiveJobs()) || []);
    res1.forEach((x) => {
      if (x.job_title.toLowerCase().includes(search.toLowerCase()))
      updatedVal1.push(x);
  });
  setActiveJob(updatedVal1);
  const updatedVal2 = [];
    const res2 = Object.values((await JobService.getIncompletedJobs()) || []);
    
    res2.forEach((x1) => {
      if (x1.job_title.toLowerCase().includes(search.toLowerCase()))
        updatedVal2.push(x1);
    });
    setIncompleteJob(updatedVal2);
    const updatedVal3 = [];
    const res3 = Object.values((await JobService.getCompletedJobs()) || []);
    res3.forEach((x2) => {
      if (x2.job_title.toLowerCase().includes(search.toLowerCase()))
      updatedVal3.push(x2);
  });
  setCompleteJob(updatedVal3);
    setLoader(false);
  };
  const getJobs = async () => {
    setLoader(true);
    const res1 = Object.values((await JobService.getActiveJobs()) || []);
    setActiveJob(res1);
    const res2 = Object.values((await JobService.getIncompletedJobs()) || []);
    setIncompleteJob(res2);
    const res3 = Object.values((await JobService.getCompletedJobs()) || []);
    setCompleteJob(res3);
    setLoader(false);
  };
  const handleAddJob = async (e) => {
    e.preventDefault();
    setLoader(true);
    if (data) {
      const res = await JobService.create(data);
      toast.success("Job added Successfully");
      setData("");
      setShowAddJobModal(false);
      setChecked([]);
    }
    setLoader(false);
  };

  // rendering
  useEffect(() => {
    if (search.length > 0) {
      const timer = setTimeout(() => {
        handleChange();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      getDepartments();
      getJobs();
    }
  }, [showAddJobModal,search]);

  if (showAddJobModal)
    return (
      <div className="modal">
        <div className="add">
          <h3>Add New Job</h3>
          {
            <form onSubmit={(e) => handleAddJob(e)}>
              <select
                className={`${data.department ? "" : "placeholder"} `}
                onChange={(e) => {
                  if (e.target.value === "-1")
                    e.target.classList.add("placeholder");
                  else e.target.classList.remove("placeholder");
                  setData({ ...data, department: e.target.value });
                }}
              >
                <option
                  selected={data.department === "-1" ? true : false}
                  value={-1}
                >
                  Select Department
                </option>
                {departments.map((dep, key) => (
                  <option
                    selected={data.departments == dep.id ? true : false}
                    key={key}
                    value={dep.id}
                  >
                    {dep.name}
                  </option>
                ))}
              </select>
              <input
                onChange={(e) =>
                  setData({ ...data, job_title: e.target.value })
                }
                type="text"
                placeholder="Enter Job Title"
                value={data.job_title}
              />
              <select
                className={`${data.office_location ? "" : "placeholder"} `}
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
              <input
                onChange={(e) => setData({ ...data, deadline: e.target.value })}
                type="text"
                placeholder="Enter Deadline"
                value={data.deadline}
                onFocus={(e) => {
                  e.target.type = "date";
                }}
                onBlur={(e) => {
                  if (e.target.value == "") e.target.type = "text";
                }}
              />
              <input
                onChange={(e) => setData({ ...data, amount: e.target.value })}
                type="text"
                placeholder="Enter Amount"
                value={data.amount}
              />
              <div className="content">
                <h3>Select Type</h3>
                <div className="values">
                  {["Remote", "Full Time"].map((type, key) => (
                    <RadioButton
                      onChange={(val) => {
                        if (val) {
                          setChecked((prev) => {
                            const arr = prev;
                            arr.push(type);
                            setData({ ...data, job_type: arr });
                            return arr;
                          });
                        } else {
                          setChecked((prev) => {
                            const arr = prev;
                            arr.splice(arr.indexOf(type), 1);
                            prev = arr;
                            setData((x) => {
                              return { ...x, job_type: arr };
                            });
                            return prev;
                          });
                        }
                      }}
                      className="child"
                      text={type}
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
                    setData("");
                    setShowAddJobModal(false);
                    setChecked([]);
                  }}
                />
                <input type="submit" value="Add" />
              </div>
            </form>
          }
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
            <button id="addBtn" onClick={() => setShowAddJobModal(true)}>
              <FaPlusCircle />
              <h3>Add New Job</h3>
            </button>
          </div>
        </div>

        {activeJob === "" ||
        incompleteJob === "" ||
        completeJob === "" ||
        loader ? (
          <Loader size={50} fullHeight={true} fullWidth={true} />
        ) : (
          <div className="bot">
            <div className="jobs">
              <div className="top">
                <div className="b1"></div>
                <h5>Active Jobs</h5>
              </div>
              {activeJob.map((a, b) => (
                <div
                  className="box"
                  key={b}
                  onClick={() => {
                    navigate(`/apply/${a.id}`);
                  }}
                >
                  <div className="top">
                    <VscBriefcase className="icon" />
                    <div className="content">
                      <h3>{a.job_title}</h3>
                      <h5>{a.department}</h5>
                    </div>
                  </div>
                  <div className="middle">
                    {a.job_type.map((x, y) => (
                      <h3 key={y}>{x}</h3>
                    ))}
                  </div>
                  <div className="bottom">
                    <div className="content">
                      <IoLocationOutline className="icon" />
                      <h3>{a.office_location}</h3>
                    </div>
                    <h3>
                      <span>{normalizeNum(a.amount)}</span>/Month
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="jobs">
              <div className="top">
                <div className="b2"></div>
                <h5>Incompleted Jobs</h5>
              </div>
              {incompleteJob.map((j, i) => (
                <div
                  className="box"
                  key={i}
                  onClick={() => {
                    navigate(`/apply/${j.id}`);
                  }}
                >
                  <div className="top">
                    <VscBriefcase className="icon" />
                    <div className="content">
                      <h3>{j.job_title}</h3>
                      <h5>{j.department}</h5>
                    </div>
                  </div>
                  <div className="middle">
                    {j.job_type.map((x1, y1) => (
                      <h3 key={y1}>{x1}</h3>
                    ))}
                  </div>
                  <div className="bottom">
                    <div className="content">
                      <IoLocationOutline className="icon" />
                      <h3>{j.office_location}</h3>
                    </div>
                    <h3>
                      {" "}
                      <span>{normalizeNum(j.amount)}</span>/Month
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="jobs">
              <div className="top">
                <div className="b3"></div>
                <h5>Completed Jobs</h5>
              </div>
              {completeJob.map((j1, i1) => (
                <div
                  className="box"
                  key={i1}
                  onClick={() => {
                    navigate(`/apply/${j1.id}`);
                  }}
                >
                  <div className="top">
                    <VscBriefcase className="icon" />
                    <div className="content">
                      <h3>{j1.job_title}</h3>
                      <h5>{j1.department}</h5>
                    </div>
                  </div>
                  <div className="middle">
                    {j1.job_type.map((x2, y2) => (
                      <h3 key={y2}>{x2}</h3>
                    ))}
                  </div>
                  <div className="bottom">
                    <div className="content">
                      <IoLocationOutline className="icon" />
                      <h3>{j1.office_location}</h3>
                    </div>
                    <h3>
                      <span>{normalizeNum(j1.amount)}</span>/Month
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* <div className="pagination">
              <div className="paging">
                {page <= 1 ? null : (
                  <FaAngleLeft onClick={() => setPage(page - 1)} />
                )}
                <h3>{page}</h3>
                {page >= maxPage ? null : (
                  <FaAngleRight onClick={() => setPage(page + 1)} />
                )}
              </div>
            </div> */}
      </div>
    );
};

export default Job;
