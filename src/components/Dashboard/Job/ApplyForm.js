import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../Loader/Loader";
import JobService from "../../../Services/JobService";
import DragFiles from "../../../Helper/DragFiles/DragFiles";
import { FaCamera } from "react-icons/fa";
import CandidateService from "../../../Services/CandidateService";
import toast from "react-hot-toast";
import "./Job.css";
import { validateEmail, validateForm } from "../../../Helper/Helper";

const ApplyForm = () => {
  // state
  const { id } = useParams();
  const [job, setJob] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState("");
  // methods
  const getJob = async () => {
    setLoader(true);
    const res = await JobService.read(id);
    setJob(res);
    setLoader(false);
  };
  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setLoader(true);
    const flag1 = validateForm(
      data.profile,
      data.first_name,
      data.last_name,
      data.mobile_number,
      data.email
    );
    const flag2 = validateEmail(data.email);

    if (flag1) {
      if (validateEmail(data.email)) {
      
        const res = await CandidateService.create({ ...data, job_id: id });
        toast.success("Form Submitted Successfully!!!");
        navigate("/apply");
      } else {
        toast.error("email must be of type abc@exmaple.com");
      }
    } else {
      toast.error("All fields are mandatory!");
    }
    setData("");
    setLoader(false);
  };

  // rendering
  useEffect(() => {
    getJob();
  }, []);

  if (loader) return <Loader size={50} fullHeight={true} fullWidth={true} />;
  else if (job == null)
    return (
      <div className="error">
        <h3>No such job is available</h3>
        <p>
          try again! There might be some network issue or you have hit the wrong
          url.
        </p>
        <button onClick={() => navigate("/apply")}>Go To Jobs</button>
      </div>
    );
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
          <h3>Apply Form</h3>
          {
            <form onSubmit={(e) => handleAddCandidate(e)}>
              {(() => {
                if (loader)
                  return (
                    <Loader size={50} fullHeight={true} fullWidth={true} />
                  );
                else {
                  return (
                    <div className="add">
                      <div className="content">
                        <DragFiles
                          className={"drag "}
                          acceptedFiles={["jpg", "png", "jpeg"]}
                          onChange={(file) =>
                            setData({ ...data, profile: file })
                          }
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
                      </div>
                      <div className="btns">
                        <input
                          type="button"
                          value="Cancel"
                          onClick={() => {
                            setData("");
                            navigate("/apply");
                          }}
                        />
                        <input type="submit" value="Add" />
                      </div>
                    </div>
                  );
                }
              })()}
            </form>
          }
        </div>
      </div>
    );
};

export default ApplyForm;
