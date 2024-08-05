import React from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

const SearchBar = ({onChange}) => {
  return (
    <div className="searchbar">
      <FaSearch />
      <input onChange={onChange} type="text" placeholder="Search" />
    </div>
  );
};

export default SearchBar;
