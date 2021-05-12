import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Cover from "../../../assets/images/invitation.png";
import axios from "../../utils/axios";
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    backgroundColor: "black",
  },
  media: {
    height: 140,
    color: "black",
  },
  content: {
    color: "black",
    backgroundColor: "white",
  },
  button: {
    display: "block",
    color: "black",
  },
});

export default function Invitation({ mine, sender, sid }) {
  const classes = useStyles();
  const receiveVideoCall = () => {
    axios.get(`/call/joinRoom?sid=${sid}`).then((res) => {
      const { data } = res;
      window.open(
        `http://localhost:3000/call/${"vuive"}?t=${data.token}&video=false`,
        "VIDEO CALL",
        "toolbar=0,status=0,width=1000,height=700"
      );
    });
  };
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={Cover}
          title={`${!mine ? sender.name : "You"} invite you join a call`}
        />
        <CardContent className={classes.content}>
          {`Click a button below to join a call with ${sender.name}`}
        </CardContent>
      </CardActionArea>
      {!mine && (
        <CardActions>
          <Button onClick={receiveVideoCall} size="large" color="secondary">
            Join
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
