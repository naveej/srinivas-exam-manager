import React, { useState } from "react";

export const Context = React.createContext();

const ContextProvider = (props) => {
  const state = {
    isAuth: true,
    role: "admin",
  };

  const [approve, setApprove] = useState("");
  const [approveText, setApproveText] = useState("Approve");
  const [rejectText, setRejectText] = useState("Reject");

  return (
    <Context.Provider
      value={{
        ...state,
        approve,
        setApprove,
        approveText,
        setApproveText,
        rejectText,
        setRejectText,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;