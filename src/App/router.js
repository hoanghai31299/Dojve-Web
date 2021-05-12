import Call from "./components/VideoCall/Call";
import Chat from "./page/Chat";
import HomePage from "./page/HomePage";
import Email from "./page/Email";
import Login from "./page/Login";
const routers = [
  {
    path: "/",
    component: HomePage,
    exact: true,
  },
  {
    path: "/email/:token",
    component: Email,
    exact: true,
  },
  {
    path: "/auth",
    component: Login,
    exact: false,
  },
  {
    path: "/chat/:roomId",
    component: Chat,
    exact: true,
  },
  {
    path: "/call/:roomId",
    component: Call,
    exact: true,
  },
];
export default routers;
