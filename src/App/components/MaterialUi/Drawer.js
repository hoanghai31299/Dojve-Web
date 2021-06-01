import { Drawer } from "antd";
import React from "react";

function DrawerRight({ title, toggleDrawer, drawer, children }) {
  return (
    <Drawer
      title={title}
      placement="right"
      closable={false}
      onClose={() => toggleDrawer(false)}
      visible={drawer}
    >
      {children}
    </Drawer>
  );
}

export default DrawerRight;
