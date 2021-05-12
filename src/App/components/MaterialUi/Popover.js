import React from "react";
import { Popover, IconButton, Tooltip, Fab } from "@material-ui/core";

export default function SimplePopover({ children, icon, fab }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="popover-btn">
      {!fab ? (
        <IconButton
          aria-describedby={id}
          variant="contained"
          color="inherit"
          onClick={handleClick}
        >
          {icon}
        </IconButton>
      ) : (
        <Tooltip title="New group chat" aria-label="Recent use">
          <Fab color="default" onClick={handleClick}>
            {icon}
          </Fab>
        </Tooltip>
      )}

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        {children}
      </Popover>
    </div>
  );
}
