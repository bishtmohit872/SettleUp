import React from "react";
import Image from "next/image";

export const NotFound = () => {
  return (
    <div className="text-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <Image src="/errorImage.png" alt="404 Error" width={500} height={500} />
      <h1 className="text-2xl font-extrabold">404 - Page Not Found</h1>
    </div>
  );
};

export default NotFound;
