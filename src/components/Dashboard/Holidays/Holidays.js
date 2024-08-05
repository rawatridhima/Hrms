import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import {
  FaAngleLeft,
  FaAngleRight,
  FaPlusCircle,
  FaTrashAlt,
} from "react-icons/fa";
import SearchBar from "../../../Helper/SearchBar/SearchBar";
import toast from "react-hot-toast";
import { FaPencil } from "react-icons/fa6";
import {
  Roles,
  formatDate,
  getDay,
  validateForm,
} from "../../../Helper/Helper";
import HolidaysService from "../../../Services/HolidaysService";
import "./Holidays.css";
import "../Employes/Employes.css";
import { useSelector } from "react-redux";

const Holidays = () => {
  //states
  const [holiday, setHoliday] = useState([]);
  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [search, setSearch] = useState("");
  const [addModal, setAddModal] = useState({ isShow: false, data: {} });
  const [editModal, setEditModal] = useState({ isShow: false, data: {} });
  const [deleteModal, setDeleteModal] = useState({ isShow: false, data: {} });
  const auth = useSelector((x) => x.auth);

  // handling functions
  const handleAdd = async (e) => {
    e.preventDefault();
    const data = addModal.data;
    if (validateForm(data.name, data.date)) {
      if (
        new Date(data.date).getFullYear() === new Date(Date.now()).getFullYear()
      ) {
        setLoader(true);
        await HolidaysService.create(data);
        toast.success("Holiday Added Successfully!");
        setAddModal({ isShow: false, data: {} });
        setLoader(false);
      } else
        toast.error(
          `You can only add holidays for ${new Date(Date.now()).getFullYear()}`
        );
    } else toast.error("All Fields are Mandatory");
  };
  const handleDelete = async () => {
    setLoader(true);
    await HolidaysService.delete([deleteModal.data?.id]);
    toast.success("Holiday Deleted Successfully");
    setDeleteModal({ isShow: false, data: {} });
    setLoader(false);
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    const data = editModal.data;
    if (validateForm(data.name, data.date)) {
      if (
        new Date(data.date).getFullYear() === new Date(Date.now()).getFullYear()
      ) {
        setLoader(true);
        await HolidaysService.update(data.id, data);
        toast.success("Holiday Updated Successfully");
        setEditModal({ isShow: false, data: {} });
        setLoader(false);
      } else
        toast.error(
          `You can only add holidays for ${new Date(Date.now()).getFullYear()}`
        );
    } else toast.error("All Fields are Mandatory");
  };
  const getAllHolidays = async () => {
    setLoader(true);
    const val = Object.values((await HolidaysService.read()) || []);
    setHoliday(val);
    const perPage = val.length / itemsPerPage;
    setMaxPage(
      Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
    );
    setLoader(false);
  };
  const handleChange = async () => {
    setLoader(true);
    const val = Object.values(await HolidaysService.read());
    const updatedVal = [];
    val.forEach((x) => {
      if (x.name.toLowerCase().includes(search.toLowerCase()))
        updatedVal.push(x);
    });
    setHoliday(updatedVal);
    const perPage = updatedVal.length / itemsPerPage;
    setMaxPage(
      Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
    );
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
      } else getAllHolidays();
    }
  }, [search, addModal.isShow, editModal.isShow, deleteModal.isShow]);

  if (addModal.isShow)
    return (
      <div className="modal">
        <div className="add">
          <h3>Add New Holiday</h3>
          {loader ? (
            <Loader size={50} />
          ) : (
            <form onSubmit={(e) => handleAdd(e)}>
              <input
                type="text"
                value={addModal.data?.name}
                onChange={(e) => {
                  setAddModal((prev) => {
                    return {
                      ...prev,
                      data: { ...prev.data, name: e.target.value },
                    };
                  });
                }}
                placeholder="Holiday Name"
              />
              <input
                type="text"
                placeholder="Date"
                value={addModal.data?.date}
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
                      data: { ...prev.data, date: e.target.value },
                    };
                  })
                }
              />
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
          <h3>Delete Holiday Records</h3>
          {loader ? (
            <Loader size={50} />
          ) : (
            <form onSubmit={(e) => handleDelete(e)}>
              <p>
                Do you want to delete the record of {deleteModal.data?.name}
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
          <h3>Edit Holidays</h3>
          {loader ? (
            <Loader size={50} />
          ) : (
            <form onSubmit={(e) => handleEdit(e)}>
              <input
                value={editModal.data?.name}
                onChange={(e) =>
                  setEditModal((prev) => {
                    return {
                      ...prev,
                      data: { ...prev.data, name: e.target.value },
                    };
                  })
                }
                type="text"
                placeholder=" Holiday Name"
              />
              <input
                type="text"
                placeholder="Date"
                value={editModal.data?.date}
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
                      data: { ...prev.data, date: e.target.value },
                    };
                  })
                }
              />
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
          {auth.user.role !== Roles.USER ? (
            <div className="btns">
              <button
                onClick={() => setAddModal({ isShow: true, data: {} })}
                id="addButton"
              >
                <FaPlusCircle />
                <h3>Add New Holiday</h3>
              </button>
            </div>
          ) : null}
        </div>

        {loader ? (
          <Loader size={50} fullWidth={true} />
        ) : holiday.length === 0 ? (
          <h3 className="empty-text-signal">No Holiday is added!!</h3>
        ) : (
          <div className="bottom">
            <table>
              <thead>
                <tr>
                  <td>Date</td>
                  <td>Day</td>
                  <td>Holiday Name</td>
                  {auth.user?.role === Roles.USER ? null : <td>Actions</td>}
                </tr>
              </thead>
              <tbody>
                {holiday
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((h, key) => {
                    const h_date = new Date(h.date);
                    const current_date = new Date(Date.now());
                    return (
                      <tr key={key}>
                        <td
                          style={{
                            borderLeft: `5px solid var(--${
                              h_date >= current_date
                                ? "secColor-1"
                                : "pannelHoverColor"
                            })`,
                          }}
                          data-id={"Date"}
                        >
                          <h3>{formatDate(h.date)}</h3>
                        </td>
                        <td data-id={"Day"}>
                          <h3>{getDay(h.date)}</h3>
                        </td>
                        <td data-id={"Holiday Name"}>
                          <h3>{h.name}</h3>
                        </td>
                        {auth.user?.role === Roles.USER ? null : (
                          <td data-id={"Actions"}>
                            <div className="table-box">
                              <FaPencil
                                onClick={() => {
                                  setEditModal({
                                    isShow: true,
                                    data: h,
                                  });
                                }}
                                className="icon"
                              />
                              <FaTrashAlt
                                onClick={() => {
                                  setDeleteModal({
                                    isShow: true,
                                    data: h,
                                  });
                                }}
                                className="icon"
                              />
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <div className="keys">
              {[
                { name: "Upcoming", color: `var(--secColor-1)` },
                { name: "Past Holidays", color: `var(--pannelHoverColor)` },
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
};

export default Holidays;
