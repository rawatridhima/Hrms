import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import {
  FaAngleLeft,
  FaAngleRight,
  FaPlusCircle,
  FaTrashAlt,
} from "react-icons/fa";
import "./Leaves.css";
import SearchBar from "../../../Helper/SearchBar/SearchBar";
import toast from "react-hot-toast";
import { FaPencil } from "react-icons/fa6";
import {
  LEAVE_STATUS,
  LEAVE_TYPES,
  Roles,
  calculateDays,
  formatDate,
  getDay,
  validateForm,
} from "../../../Helper/Helper";
import LeaveService from "../../../Services/LeaveService";
import "./Leaves.css";
import "../Employes/Employes.css";
import "../Holidays/Holidays.css";
import { useSelector } from "react-redux";
import EmployeeService from "../../../Services/EmployeeService";
import AttendanceService from "../../../Services/AttendanceService";

const Leaves = () => {
  //states
  const [leaves, setLeaves] = useState([]);
  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [search, setSearch] = useState("");
  const [addModal, setAddModal] = useState({ isShow: false, data: {} });
  const [editModal, setEditModal] = useState({ isShow: false, data: {} });
  const [deleteModal, setDeleteModal] = useState({ isShow: false, data: {} });
  const [leavesAdmin, setLeavesAdmin] = useState([]);
  const auth = useSelector((x) => x.auth);

  // handling functions
  const handleAdd = async (e) => {
    e.preventDefault();
    const data = addModal.data;
    if (validateForm(data.from_date, data.to_date, data.leave_type)) {
      const from = new Date(data.from_date);
      const to = new Date(data.to_date);
      const curr = new Date(Date.now());
      if (
        from.getFullYear() === curr.getFullYear() &&
        curr.getFullYear() === to.getFullYear()
      ) {
        if (from <= to) {
          setLoader(true);
          await LeaveService.create({
            ...data,
            status: LEAVE_STATUS.PENDING,
            user: auth.user?.id,
          });
          toast.success("Leave Request Added Successfully");
          setAddModal({ isShow: false, data: {} });
          setLoader(false);
        } else toast.error("From Date must be less or equals to To Date");
      } else
        toast.error(
          `You can only add leaves for ${new Date(Date.now()).getFullYear()}`
        );
    } else toast.error("All Fields are Mandatory");
  };
  const handleDelete = async () => {
    setLoader(true);
    await LeaveService.delete([deleteModal.data?.id]);
    toast.success("Leave Data Deleted Successfully");
    setDeleteModal({ isShow: false, data: {} });
    setPage(1);
    setLoader(false);
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    const data = editModal.data;
    if (validateForm(data.from_date, data.to_date, data.leave_type)) {
      const from = new Date(data.from_date);
      const to = new Date(data.to_date);
      const curr = new Date(Date.now());
      if (
        from.getFullYear() === curr.getFullYear() &&
        curr.getFullYear() === to.getFullYear()
      ) {
        if (from <= to) {
          setLoader(true);
          await LeaveService.update(data.id, {
            ...data,
            status: LEAVE_STATUS.PENDING,
            user: auth.user?.id,
          });
          toast.success("Leave Request Updated Successfully");
          setEditModal({ isShow: false, data: {} });
          setLoader(false);
        } else toast.error("From Date must be less or equals to To Date");
      } else
        toast.error(
          `You can only add leaves for ${new Date(Date.now()).getFullYear()}`
        );
    } else toast.error("All Fields are Mandatory");
  };
  const getAllLeavesAdmin = async () => {
    setLoader(true);
    const val = Object.values((await LeaveService.read()) || []);
    const new_val = [];
    for (let x of val) {
      new_val.push({ ...x, user: await EmployeeService.read(x.user) });
    }
    setLeavesAdmin(new_val);
    const perPage = val.length / itemsPerPage;
    setMaxPage(
      Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
    );
    setLoader(false);
  };
  const getAllLeaves = async () => {
    setLoader(true);
    const val = await LeaveService.getAllLeavesByEmployee(auth.user?.id);
    setLeaves(val);
    const perPage = val.length / itemsPerPage;
    setMaxPage(
      Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
    );
    setLoader(false);
  };
  const handleChange = async () => {
    setLoader(true);
    let val = null;
    const updatedVal = [];
    if (auth.user?.role !== Roles.USER) {
      val = Object.values((await LeaveService.read()) || []);
      const new_val = [];
      for (let x of val) {
        new_val.push({ ...x, user: await EmployeeService.read(x.user) });
      }
      new_val.forEach((x) => {
        if (x.user?.name.toLowerCase().includes(search.toLowerCase()))
          updatedVal.push(x);
      });
      setLeavesAdmin(updatedVal);
    } else {
      val = await LeaveService.getAllLeavesByEmployee(auth.user?.id);
      val.forEach((x) => {
        if (x.leave_type.toLowerCase().includes(search.toLowerCase()))
          updatedVal.push(x);
      });
      setLeaves(updatedVal);
    }
    const perPage = updatedVal.length / itemsPerPage;
    setMaxPage(
      Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
    );
    setPage(1);
    setLoader(false);
  };
  const handleChangeStatus = async (leave, leave_status) => {
    setLoader(true);
    await LeaveService.update(leave.id, {
      ...leave,
      status: leave_status,
      user: leave.user?.id,
    });
    if(leave_status=== LEAVE_STATUS.ACCEPT){
      await AttendanceService.giveLeave(
        leave.user?.id,
        leave.from_date,
        leave.to_date
      )
    }
    else if (leave_status === LEAVE_STATUS.REJECT) {
      await AttendanceService.cancelLeave(
        leave.user?.id,
        leave.from_date,
        leave.to_date
      );
    }
    toast.success(`Status changed to ${leave_status} Successfully.`);
    await getAllLeavesAdmin();
    setLoader(false);
  };

  //Rendering

  useEffect(() => {
    if (!addModal.isShow && !editModal.isShow && !deleteModal.isShow) {
      if (search.length > 0) {
        const timer = setTimeout(() => {
          handleChange();
        }, 500);
        return () => clearTimeout(timer);
      } else {
        if (auth.user?.role !== Roles.USER) getAllLeavesAdmin();
        else getAllLeaves();
      }
    }
  }, [search, addModal.isShow, editModal.isShow, deleteModal.isShow]);

  if (auth.user?.role !== Roles.USER) {
    return (
      <div className="Employee">
        <div className="top">
          <SearchBar onChange={(e) => setSearch(e.target.value)} />
        </div>
        {loader ? (
          <Loader size={50} fullWidth={true} />
        ) : leavesAdmin.length === 0 ? (
          <h3 className="empty-text-signal">No Leave Request is added!!</h3>
        ) : (
          <div className="bottom">
            <table>
              <thead>
                <tr>
                  <td>Employee</td>
                  <td>From Date</td>
                  <td>To Date</td>
                  <td>Days</td>
                  <td>Leave Type</td>
                  <td>Status</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {leavesAdmin
                  .sort((a, b) => new Date(a.from_date) - new Date(b.from_date))
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((leave, key) => {
                    return (
                      <tr key={key}>
                        <td
                          data-id={"Employee"}
                          style={{
                            borderLeft: `5px solid var(--${
                              leave.status === LEAVE_STATUS.PENDING
                                ? "textColor-2"
                                : leave.status === LEAVE_STATUS.ACCEPT
                                ? "toggleBtn"
                                : "textColor-3"
                            })`,
                          }}
                        >
                          <div className="table-box">
                            <img src={leave.user?.profile} alt="" />
                            <h3>{leave.user?.name}</h3>
                          </div>
                        </td>
                        <td data-id={"From Date"}>
                          <h3>{formatDate(leave.from_date)}</h3>
                        </td>
                        <td data-id={"To Date"}>
                          <h3>{formatDate(leave.to_date)}</h3>
                        </td>
                        <td data-id={"Days"}>
                          <h3>
                            {calculateDays(leave.from_date, leave.to_date)}
                          </h3>
                        </td>
                        <td data-id={"Leave Type"}>
                          <h3>{leave.leave_type}</h3>
                        </td>
                        <td data-id={"Status"} className="color-td">
                          <h3>{leave.status}</h3>
                        </td>
                        <td data-id={"Actions"}>
                          <div
                            style={{
                              flexDirection: "column",
                            }}
                            className="table-box"
                          >
                            {leave.status === LEAVE_STATUS.PENDING ? (
                              <>
                                <button
                                  style={{
                                    backgroundColor: "#3FC28A1A",
                                    color:"#3FC28A",
                                    borderRadius:"5px",
                                    padding:"4px",
                                    fontSize:"11px",
                                    border:'none'
                                  }}
                                  onClick={() =>
                                    handleChangeStatus(
                                      leave,
                                      LEAVE_STATUS.ACCEPT
                                    )
                                  }
                                >
                                  Accept
                                </button>
                                <button
                                  style={{
                                    backgroundColor: "#F45B691A",
                                  color:"#F45B69",
                                    borderRadius:"5px",
                                    padding:"3px",
                                    border:'none',
                                    fontSize:'11px'
                                  }}
                                  onClick={() =>
                                    handleChangeStatus(
                                      leave,
                                      LEAVE_STATUS.REJECT
                                    )
                                  }
                                >
                                  Reject
                                </button>
                              </>
                            ) : leave.status === LEAVE_STATUS.ACCEPT ? (
                              <button
                                style={{
                                  backgroundColor: "#F45B691A",
                                  color:"#F45B69",
                                    borderRadius:"5px",
                                    padding:"3px",
                                    border:'none',
                                    fontSize:'11px'
                                }}
                                onClick={() =>
                                  handleChangeStatus(leave, LEAVE_STATUS.REJECT)
                                }
                              >
                                Reject
                              </button>
                            ) : (
                              <button
                                style={{  backgroundColor: "#3FC28A1A",
                                    color:"#3FC28A",
                                    borderRadius:"5px",
                                    padding:"4px",
                                    fontSize:"11px",
                                    border:'none' }}
                                onClick={() =>
                                  handleChangeStatus(leave, LEAVE_STATUS.ACCEPT)
                                }
                              >
                                Accept
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <div className="keys">
              {[
                { name: "Pending", color: `var(--textColor-2)` },
                { name: "Accepted", color: `var(--toggleBtn)` },
                { name: "Rejected", color: `var(--textColor-3)` },
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
    if (addModal.isShow)
      return (
        <div className="modal">
          <div className="add">
            <h3>Add New Leave Request</h3>
            {loader ? (
              <Loader size={50} />
            ) : (
              <form onSubmit={(e) => handleAdd(e)}>
                <input
                  type="text"
                  placeholder="From-Date"
                  value={addModal.data?.from_date}
                  onFocus={(e) => {
                    e.target.type = "date";
                  }}
                  onBlur={(e) => {
                    if (e.target.value == "") e.target.type = "text";
                  }}
                  onChange={(e) =>
                    setAddModal((prev) => {
                      return {
                        ...prev,
                        data: { ...prev.data, from_date: e.target.value },
                      };
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="To-Date"
                  value={addModal.data?.to_date}
                  onFocus={(e) => {
                    e.target.type = "date";
                  }}
                  onBlur={(e) => {
                    if (e.target.value == "") e.target.type = "text";
                  }}
                  onChange={(e) =>
                    setAddModal((prev) => {
                      return {
                        ...prev,
                        data: { ...prev.data, to_date: e.target.value },
                      };
                    })
                  }
                />
                <select
                  className={addModal.data?.leave_type ? "" : "placeholder"}
                  onChange={(e) => {
                    if (e.target.value === "-1")
                      e.target.classList.add("placeholder");
                    else e.target.classList.remove("placeholder");
                    setAddModal((prev) => {
                      return {
                        ...prev,
                        data: { ...prev.data, leave_type: e.target.value },
                      };
                    });
                  }}
                >
                  <option
                    selected={addModal.data?.leave_type == "-1" ? true : false}
                    value={-1}
                  >
                    Select Leave Type
                  </option>
                  {Object.values(LEAVE_TYPES)[0]
                    .concat(Object.values(LEAVE_TYPES)[1])
                    .map((x, i) => (
                      <option
                        selected={
                          addModal.data?.leave_type === x ? true : false
                        }
                        key={i}
                        value={x}
                      >
                        {x}
                      </option>
                    ))}
                </select>
                <div className="btns">
                  <input
                    type="button"
                    value="Cancel"
                    onClick={() => setAddModal({ isShow: false, data: {} })}
                  />
                  <input type="submit" value="Add" />
                </div>
              </form>
            )}
          </div>
        </div>
      );
    else if (deleteModal.isShow)
      return (
        <div className="modal">
          <div className="add">
            <h3>Delete Leave Request Record</h3>
            {loader ? (
              <Loader size={50} />
            ) : (
              <form onSubmit={(e) => handleDelete(e)}>
                <p>
                  Do you want to delete the record of{" "}
                  {deleteModal.data?.leave_type}
                </p>
                <div className="btns">
                  <input
                    type="button"
                    value="Cancel"
                    onClick={() => setDeleteModal({ isShow: false, data: {} })}
                  />
                  <input type="submit" value="Delete" />
                </div>
              </form>
            )}
          </div>
        </div>
      );
    else if (editModal.isShow)
      return (
        <div className="modal">
          <div className="add">
            <h3>Edit Leave</h3>
            {loader ? (
              <Loader size={50} />
            ) : (
              <form onSubmit={(e) => handleEdit(e)}>
                <input
                  type="text"
                  placeholder="From Date"
                  value={editModal.data?.from_date}
                  onFocus={(e) => {
                    e.target.type = "date";
                  }}
                  onBlur={(e) => {
                    if (e.target.value == "") e.target.type = "text";
                  }}
                  onChange={(e) =>
                    setEditModal((prev) => {
                      return {
                        ...prev,
                        data: { ...prev.data, from_date: e.target.value },
                      };
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="To Date"
                  value={editModal.data?.to_date}
                  onFocus={(e) => {
                    e.target.type = "date";
                  }}
                  onBlur={(e) => {
                    if (e.target.value == "") e.target.type = "text";
                  }}
                  onChange={(e) =>
                    setEditModal((prev) => {
                      return {
                        ...prev,
                        data: { ...prev.data, to_date: e.target.value },
                      };
                    })
                  }
                />
                <select
                  className={editModal.data?.leave_type ? "" : "placeholder"}
                  onChange={(e) => {
                    if (e.target.value === "-1")
                      e.target.classList.add("placeholder");
                    else e.target.classList.remove("placeholder");
                    setEditModal((prev) => {
                      return {
                        ...prev,
                        data: { ...prev.data, leave_type: e.target.value },
                      };
                    });
                  }}
                >
                  <option
                    selected={editModal.data?.leave_type == "-1" ? true : false}
                    value={-1}
                  >
                    Select Employee Type
                  </option>
                  {Object.values(LEAVE_TYPES)[0]
                    .concat(Object.values(LEAVE_TYPES)[1])
                    .map((type, key) => (
                      <option
                        selected={
                          editModal.data?.leave_type === type ? true : false
                        }
                        key={key}
                        value={type}
                      >
                        {type}
                      </option>
                    ))}
                </select>
                <div className="btns">
                  <input
                    type="button"
                    value="Cancel"
                    onClick={() => setEditModal({ isShow: false, data: {} })}
                  />
                  <input type="submit" value="Edit" />
                </div>
              </form>
            )}
          </div>
        </div>
      );
    else
      return (
        <div className="Employee">
          <div className="top">
            <SearchBar
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <div className="btns">
              <button
                onClick={() => setAddModal({ isShow: true, data: {} })}
                id="addButton"
              >
                <FaPlusCircle />
                <h3>Add New Leave Request</h3>
              </button>
            </div>
          </div>

          {loader ? (
            <Loader size={50} fullWidth={true} />
          ) : leaves.length === 0 ? (
            <h3 className="empty-text-signal">No Leave is added!!</h3>
          ) : (
            <div className="bottom">
              <table>
                <thead>
                  <tr>
                    <td>From Date</td>
                    <td>To Date</td>
                    <td>Leave Type</td>
                    <td>Status</td>
                    <td>Duration</td>
                    <td>Actions</td>
                  </tr>
                </thead>
                <tbody>
                  {leaves
                    .sort(
                      (a, b) => new Date(a.from_date) - new Date(b.from_date)
                    )
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((leave, key) => {
                      const from = new Date(leave.from_date);
                      const to = new Date(leave.to_date);
                      const current_date = new Date(Date.now());
                      return (
                        <tr key={key}>
                          <td
                            style={{
                              borderLeft: `5px solid var(--${
                                from >= current_date
                                  ? "secColor-1"
                                  : "pannelHoverColor"
                              })`,
                            }}
                            data-id={"From Date"}
                          >
                            <h3>{formatDate(leave.from_date)}</h3>
                          </td>
                          <td data-id={"To Date"}>
                            <h3>{formatDate(leave.to_date)}</h3>
                          </td>
                          <td data-id={"Leave Type"}>
                            <h3>{leave.leave_type}</h3>
                          </td>
                          <td data-id={"Status"} className="color-td">
                            <h3>{leave.status}</h3>
                          </td>
                          <td data-id={"Duration"}>
                            <h3>{calculateDays(from, to)}</h3>
                          </td>
                          <td data-id={"Actions"}>
                            <div className="table-box">
                              <FaPencil
                                onClick={() => {
                                  setEditModal({
                                    isShow: true,
                                    data: leave,
                                  });
                                }}
                                className="icon"
                              />
                              <FaTrashAlt
                                onClick={() => {
                                  setDeleteModal({
                                    isShow: true,
                                    data: leave,
                                  });
                                }}
                                className="icon"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              <div className="keys">
                {[
                  {
                    name: "Upcoming Leave Request",
                    color: `var(--secColor-1)`,
                  },
                  {
                    name: "Past Leave Request",
                    color: `var(--pannelHoverColor)`,
                  },
                ].map((x, i) => (
                  <div key={i} className="key">
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
  }
};

export default Leaves;
