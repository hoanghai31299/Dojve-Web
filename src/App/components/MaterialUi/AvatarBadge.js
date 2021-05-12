import React, { useEffect, useState } from "react";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";
import { getFirstLetter, getRandomColor } from "../../utils/common";
const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

export default function BadgeAvatars({ src, status, name }) {
  const [color, setColor] = useState(["#DE2441", "#FFFFFF"]);
  useEffect(() => {
    setColor(getRandomColor());
  }, []);
  if (status)
    return (
      <div>
        <StyledBadge
          overlap="circle"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          variant="dot"
        >
          <Avatar
            style={{ backgroundColor: color[0], color: color[1] }}
            alt="online"
            src={src}
          >
            {getFirstLetter(name)}
          </Avatar>
        </StyledBadge>
      </div>
    );
  return (
    <Avatar
      alt="online"
      src={src}
      style={{ backgroundColor: color[0], color: color[1] }}
    >
      {getFirstLetter(name)}
    </Avatar>
  );
}
