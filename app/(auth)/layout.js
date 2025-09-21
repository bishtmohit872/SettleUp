import React from "react";

const AuthLayout = ({ children }) => {
  return <div className="flex flex-col lg:flex-row items-center justify-center pt-40 px-40" >
    <img className="hidden lg:block size-140" src="/login_back.jpg" alt="login"/>
    {children}
  </div>;
};

export default AuthLayout;
