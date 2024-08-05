import React, { useEffect, useState } from "react";
import SearchBar from "../../../Helper/SearchBar/SearchBar";
import JobService from "../../../Services/JobService";
import { FaBriefcase } from "react-icons/fa";
import Loader from "../../Loader/Loader";
import { FaLocationPin } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { normalizeNum } from "../../../Helper/Helper";
import { useNavigate } from "react-router-dom";
import "./Job.css";
import { VscBriefcase } from "react-icons/vsc";

const Apply = () => {
  // state
  const [job, setJob] = useState([]);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");
  const navigate=useNavigate();

  // methods
  const getJobs = async () => {
    setLoader(true);
    const res = await JobService.getActiveJobs();
    setJob(res);
    setLoader(false);
  };
  const handleChange = async () => {
    setLoader(true);
    const updatedVal = [];
    job.forEach((x) => {
      if (x.job_title.toLowerCase().includes(search.toLocaleLowerCase()))
        updatedVal.push(x);
      setJob(updatedVal);
      setLoader(false);
    });
  };

  useEffect(() => {
    if (search.length > 0) {
      const timer = setTimeout(() => {
        handleChange();
      }, 500);
      return () => clearTimeout(timer);
    }
    getJobs();
    
  }, [search]);
 
  if (loader) return <Loader size={50} fullHeight={true} fullWidth={true} />;
  else
    return (
      <div className="page">
        <div className="header">
          <div className="logo">
            <img src={require("../../../Assests/images/logo.png")} alt="" />
            <h1>HRMS</h1>
          </div>
        </div>
        <div className="hero">
          <h3>Open Positions</h3>
          <SearchBar onChange={(e)=>setSearch(e.target.value)} />
          <div className="jobs">
            {job.map((j, i) => (
              <div className="box" key={i} onClick={()=>{
                navigate(`/apply/${j.id}`)
              }}>
                <div className="top">
                <VscBriefcase className="icon"/>
                  <div className="content">
                    <h3>{j.job_title}</h3>
                    <h5>{j.department}</h5>
                  </div>
                </div>
                <div className="middle">
                    {
                        j.job_type.map((x,y)=>(
                            <h3 key={y}>{x}</h3>
                        ))
                    }
                </div>
                <div className="bottom">
                    <div className="content">
                    <IoLocationOutline className="icon" />
                    <h3>{j.office_location}</h3>
                    </div>
                    <h3> <span>{normalizeNum(j.amount)}</span>/Month</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

export default Apply;
