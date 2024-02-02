import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword("");
    } else {
      navigate("/");
    }
  };
  return (
    <div>
      <form onSubmit={submitHandler} className="flex">
        <input
          type="text"
          name="q"
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          placeholder="Search Products..."
          className="mr-2 ml-5 p-1 border border-gray-300 rounded"
        />
        <button type="submit" className="p-1 bg-green-500 text-white rounded">
          Search🔍
        </button>
      </form>
    </div>
  );
};

export default SearchBox;
