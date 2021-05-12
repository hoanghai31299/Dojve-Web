import { Avatar, IconButton, LinearProgress } from "@material-ui/core";
import { Add, Info } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { getFirstLetter } from "../../utils/common";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";
function SidebarPeople() {
  const [people, setPeople] = useState(undefined);
  const socket = useSelector((state) => state.socket.current);
  useEffect(() => {
    axios.get("/user").then((res) => {
      const { data } = res;
      if (!data.error) {
        setPeople(data.users);
      }
    });
  }, []);
  const sendRequest = (id) => {
    const data = {
      action: "SEND",
      to: id,
    };
    socket.emit("friends", data, (res) => {});
  };

  if (!people) return <LinearProgress />;
  else
    return (
      <div className="sidebar-people">
        {people.map((user) => {
          return (
            <div key={user._id} className="request-item">
              <Avatar src={user.avatar}>{getFirstLetter(user.name)}</Avatar>
              <h3>{user.name}</h3>
              <div className="rq-btn">
                <IconButton
                  onClick={() => sendRequest(user._id)}
                  variant="contained"
                  color="secondary"
                >
                  <Add />
                </IconButton>
                <IconButton variant="contained" color="primary">
                  <Info />
                </IconButton>
              </div>
            </div>
          );
        })}
      </div>
    );
}

export default SidebarPeople;
