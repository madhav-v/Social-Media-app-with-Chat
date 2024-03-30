import { Outlet } from "react-router-dom";
import Chat from ".";

const ChatLayout = () => {
  return (
    <>
      <div className="w-full mt-[5.5%]">
        <div className="">
          <div className=" ">
            <Chat />
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatLayout;
