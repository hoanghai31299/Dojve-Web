import { Avatar, Button, LinearProgress } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { getFirstLetter } from "../../utils/common";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";
import { message } from "antd";
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
    message.info("Send request successful!");
    setPeople((people) => {
      return people.filter((p) => p._id === id);
    });
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
                <Button
                  onClick={() => sendRequest(user._id)}
                  variant="contained"
                  size="small"
                  color="primary"
                >
                  Add friend
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
}

export default SidebarPeople;
