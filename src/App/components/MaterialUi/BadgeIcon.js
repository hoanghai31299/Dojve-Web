import { Badge } from "@material-ui/core";

function BadgeIcon({ number, children }) {
  return (
    <Badge badgeContent={number} color="secondary">
      {children}
    </Badge>
  );
}

export default BadgeIcon;
