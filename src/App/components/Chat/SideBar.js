import React, { useState } from "react";
import { Avatar, IconButton, LinearProgress } from "@material-ui/core";
import {
  Cancel,
  SearchOutlined,
  GroupAddOutlined,
  ExitToAppOutlined,
} from "@material-ui/icons";
import SidebarTab from "../SideBarTab/SideBarTab";
import SidebarPeople from "./SidebarPeople";
import { useSelector } from "react-redux";
import SimplePopover from "../MaterialUi/Popover";
import GroupAdd from "../SideBarTab/GroupAdd";
import { getFirstLetter } from "../../utils/common";
import { Popconfirm } from "antd";
import axios from "../../utils/axios";
import { useHistory } from "react-router";

function SideBar({ setExpand }) {
  const [search, setSearch] = useState(false);
  const history = useHistory();
  const user = useSelector((state) => state.user.current);
  const socket = useSelector((state) => state.socket.current);
  const onSignout = () => {
    axios.get("/auth/signout").then((res) => {
      history.push("/auth");
      socket.emit("forceDisconnect");
    });
  };
  if (user.name)
    return (
      <div className="sidebar">
        <div className="header">
          <div className="user-info">
            {!user?.avatar ? (
              <Avatar className="avatar">{getFirstLetter(user.name)}</Avatar>
            ) : (
              <div className="avatar active">
                <img src={user.avatar} alt="user avatar" />
              </div>
            )}
            <div className="user-name">
              <h3>{user.name}</h3>
            </div>
          </div>
          <div className="user-action">
            <Popconfirm
              placement="topLeft"
              title={"Sign out?"}
              onConfirm={onSignout}
              okText="Yes"
              cancelText="No"
            >
              <IconButton aria-label="more">
                <ExitToAppOutlined />
              </IconButton>
            </Popconfirm>
          </div>
        </div>
        <div className="sidebar-action">
          <div className="sidebar-search">
            <div
              className={`sidebar-search-container ${search ? "active" : ""} `}
            >
              <IconButton
                onClick={() => setSearch(false)}
                className="btn-cancel"
              >
                <Cancel />
              </IconButton>
              <IconButton className="btn-search">
                <SearchOutlined />
              </IconButton>
              <input
                type="text"
                onClick={() => setSearch(true)}
                placeholder="People or messages"
              />
              <div className="sidebar-people">
                {search && <SidebarPeople />}
              </div>
            </div>
          </div>
          <SidebarTab setExpand={setExpand} user={user} />
        </div>
        <div className="grouppadd">
          <SimplePopover icon={<GroupAddOutlined />}>
            <GroupAdd />
          </SimplePopover>
        </div>
      </div>
    );
  else return <LinearProgress />;
}

export default SideBar;
