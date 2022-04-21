import { FC } from "react";
import { Outlet } from "react-router-dom";

const PreLoginTemplate: FC = () => {
  return (
    <div className="max-w-lg w-[512px] mx-auto my-16 border-8 rounded-2xl border-amber-600 p-4">
      <Outlet />
    </div>
  );
};

export default PreLoginTemplate;
