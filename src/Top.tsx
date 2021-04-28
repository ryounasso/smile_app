import React from "react";
import { Link } from "react-router-dom";
// import "./tailwind.css";

export const Top = () => {
  return (
    <>
      <div className="grid grid-cols-5">
        <div className="col-span-3 text-center flex items-center justify-center">
          <Link className="p-4 bg-blue-300 rounded-lg  " to="/main">
            日報を見る
          </Link>
        </div>
      </div>
    </>
  );
};
