import React, { useEffect, useState } from "react";
import CandidateService from "../../../Services/CandidateService";
import SearchBar from "../../../Helper/SearchBar/SearchBar";
import Loader from "../../Loader/Loader";
import JobService from "../../../Services/JobService";
import { Candidate_status } from "../../../Helper/Helper";
import toast from "react-hot-toast";

const Candidates = () => {
  //states
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState("");
  const [loader, setLoader] = useState(false);
  const [status, setStatus] = useState("Inprogress");

  // methods
  const getCandidates = async () => {
    setLoader(true);
    const res = Object.values((await CandidateService.read()) || []);
    const arr = [];
    for (let c of res) {
      arr.push({ ...c, job_title: await JobService.getJobTitle(c.job_id) });
    }
    setCandidates(arr);
    setLoader(false);
  };
  const markStatus = async (x) => {
    setLoader(true);
   const res= await CandidateService.read(x.id);
   
    if (res.action !== Candidate_status.INPROGRESS) {
      await CandidateService.update(x.id, x);
      toast.success("Attendance Status Updated to " + x.action);
    } else {
      await CandidateService.update(x.id, x);
      toast.success("Attendance Status Marked to " + x.action);
    }
     await getCandidates()
    setLoader(false);

  };

  // rendering
  useEffect(() => {
    getCandidates();
  }, [status]);
  return (
    <div className="Employee">
      <div className="top">
        <SearchBar
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      {candidates === "" || loader ? (
        <Loader size={50} fullHeight={true} fullWidth={true} />
      ) : (
        <div className="bottom">
          <table>
            <thead>
              <tr>
                <td>Candidate Name</td>
                <td>Applied For</td>
                <td>Applied Date</td>
                <td>Mobile Number</td>
                <td>Status</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {candidates

                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((emp, key) => (
                  <tr key={key}>
                    <td data-id={"Candidate Name"}>
                      <div className="table-box">
                        <img src={emp.profile} alt="" />
                        <h3>{`${emp.first_name} ${emp.last_name}`}</h3>
                      </div>
                    </td>
                    <td data-id={"Applied For"}>
                      <h3>{emp.job_title}</h3>
                    </td>
                    <td data-id={"Applied Date"}>
                      <h3>{new Date(emp.timeStamp).toDateString()}</h3>
                    </td>
                    <td data-id={"Mobile Number"}>
                      <h3>{emp.mobile_number}</h3>
                    </td>
                    <td data-id={"Status"}>
                      <h3>{emp.action}</h3>
                    </td>

                    <td data-id={"Action"}>
                      <div className="table-box">
                        {emp && emp.action !== Candidate_status.INPROGRESS  ? (
                          emp.action === Candidate_status.SELECTED ? (
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
                                markStatus({
                                  ...emp,
                                  action: Candidate_status.REJECTED,
                                })
                              }
                              onChange={() => setStatus("Rejected")}
                            >
                              Reject
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
                                markStatus({
                                  ...emp,
                                  action: Candidate_status.SELECTED,
                                })
                              }
                              onChange={() => setStatus("Selected")}
                            >
                              Select
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
                                markStatus({
                                  ...emp,
                                  action: Candidate_status.SELECTED,
                                })
                              }
                              onChange={() => setStatus("Selected")}
                            >
                              Select
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
                                markStatus({
                                  ...emp,
                                  action: Candidate_status.REJECTED,
                                })
                              }
                              onChange={() => setStatus("Rejected")}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Candidates;
