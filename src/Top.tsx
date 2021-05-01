import React from "react";
import { Link } from "react-router-dom";
import "./tailwind.css";

export const Top = () => {
  return (
    <>
      <div className="grid grid-cols-2">
        <div className="col-span-1 bg-blue-400 h-screen justify-center flex items-center">
          <h1 className="text-white block text-5xl">笑ってはいけない○○時</h1>
        </div>
        {/* <div className="bg-white"></div> */}
        <div className="text-center flex items-center justify-center">
          <Link
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded block"
            to="/main"
          >
            笑ってはいけない にチャレンジする
          </Link>
        </div>
      </div>
    </>
  );
};
