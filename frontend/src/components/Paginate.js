import React, { useState } from "react";
import { Link } from "react-router-dom";

const Pagination = ({
  pages: totalPages,
  page,
  isAdmin = false,
  keyword = "",
}) => {
  // const handlePageChange = (newPage) => {
  //   if (newPage >= 1 && newPage <= totalPages) {
  //     setActivePage(newPage);
  //     console.log(`Navigating to page ${newPage}`);
  //   }
  // };

  return (
    totalPages > 1 && (
      <div className="flex items-center gap-3">
        {[...Array(totalPages).keys()].map((x) => (
          <Link
            key={x + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : `/page/${x + 1}`
                : `/admin/productlist/${x + 1}`
            }
          >
            <span
              className={
                page === x + 1
                  ? "font-bold text-white bg-black rounded p-2"
                  : "bg-gray-300 rounded p-2"
              }
            >
              {x + 1}
            </span>
          </Link>
        ))}
      </div>
    )
  );
};

export default Pagination;
