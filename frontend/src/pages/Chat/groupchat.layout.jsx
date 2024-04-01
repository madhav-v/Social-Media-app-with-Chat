import { Outlet } from "react-router-dom";
import Chat from ".";
import GroupChat from "./groupchat";

const GroupLayout = () => {
  return (
    <>
      <div className=" w-full mt-[5.5%]">
        <div className="">
          <div className=" ">
            <GroupChat />
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupLayout;
