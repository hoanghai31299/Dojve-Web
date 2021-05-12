import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  FormControl,
  Input,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from "@material-ui/core";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRoom } from "../../../redux/features/rooms";
import axios from "../../utils/axios";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
function GroupAdd() {
  const classes = useStyles();
  const theme = useTheme();
  const user = useSelector((state) => state.user.current);
  const [friends, setFriends] = useState([]);
  const [group, setGroup] = useState({ name: "", members: [] });
  const socket = useSelector((state) => state.socket.current);
  const dispatch = useDispatch();
  useEffect(() => {
    axios.get(`/user/${user._id}`).then((res) => {
      const { data } = res;
      if (!data.error) {
        console.log(data);
        setFriends(data.user.friends);
      } else console.log(data);
    });
  }, [user]);
  const handleChange = (e) => {
    if (e.target.name === "name") setGroup({ ...group, name: e.target.value });
    else setGroup({ ...group, members: e.target.value });
  };
  const createNewRoom = () => {
    if (!group.name) return message.error("Please enter your group name");
    if (!group.members > 0)
      return message.error("Please add your room's members");
    return axios.post("/rooms", group).then(({ data }) => {
      if (data.room) {
        dispatch(addRoom(data.room));
        socket.emit("friends", {
          action: "ADD_GROUP",
          room: data.room,
          to: group.members,
        });
      }
    });
  };
  return (
    <Card>
      <CardContent>
        <div className="form-groupadd">
          <TextField
            id="standard-full-width"
            label="Label"
            name="name"
            style={{ margin: 8 }}
            placeholder="Group Name"
            fullWidth
            value={group.name}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-mutiple-chip-label">Members</InputLabel>
            <Select
              labelId="demo-mutiple-chip-label"
              id="demo-mutiple-chip"
              multiple
              value={group.members}
              onChange={handleChange}
              input={<Input id="select-multiple-chip" />}
              renderValue={(selected) => (
                <div className={classes.chips}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={friends.find((fr) => fr._id === value).name}
                      className={classes.chip}
                    />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {friends.map((fr) => (
                <MenuItem
                  key={fr._id}
                  value={fr._id}
                  style={getStyles(fr._name, friends, theme)}
                >
                  {fr.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </CardContent>
      <CardActions>
        <Button onClick={createNewRoom} size="small" color="primary">
          Create
        </Button>
      </CardActions>
    </Card>
  );
}

export default GroupAdd;
