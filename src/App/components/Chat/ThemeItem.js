import { Tooltip } from "@material-ui/core";
import React from "react";

function ThemeItem({ theme, handleChangeTheme }) {
  return (
    <div className="theme-item-container">
      <Tooltip title={`Change theme to ${theme.name}`}>
        <div
          onClick={handleChangeTheme}
          style={{ backgroundColor: theme.myTextBgc }}
          className="theme-item"
        ></div>
      </Tooltip>
      <span>{theme.name}</span>
    </div>
  );
}

export default ThemeItem;
