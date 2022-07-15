import { FC } from "react";
import { Outlet } from "react-router-dom";

const EntranceTemplate: FC = () => {
  return (
    <div className="max-w-lg w-[512px] mx-auto my-16 border-8 rounded-2xl border-amber-600 bg-neutral-50 p-4">
      <Outlet />
    </div>
  );
};

export default EntranceTemplate;
