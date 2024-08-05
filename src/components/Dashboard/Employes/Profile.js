import React, { useEffect, useState } from "react";
import { checkIsSingleDataExist } from "../../../Helper/Helper";
import { HiOutlineDownload } from "react-icons/hi";
import { IoEyeOutline } from "react-icons/io5";

const Profile = ({ pages, emp }) => {
  const [modalPage, setModalPage] = useState(0);

  return (
    <div className="profile">
      <div className="pages">
        {pages.map((page, key) =>
          checkIsSingleDataExist(page.datas(emp), "val") ? (
            <button
              className={key === modalPage ? "active" : ""}
              onClick={() => {
                setModalPage(key);
              }}
              key={key}
            >
              <h3>{page.name}</h3>
              {page.icon}
            </button>
          ) : null
        )}
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
  );
};

export default Profile;
