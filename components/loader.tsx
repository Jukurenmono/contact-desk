import React from "react";
import MoonLoader from "react-spinners/MoonLoader";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-fit">
      <MoonLoader color="#36454F" size={100} speedMultiplier={1} />
    </div>
  );
};

export default Loader;
