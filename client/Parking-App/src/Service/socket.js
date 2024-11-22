import {io} from "socket.io-client";
const socket = io("https://park-me-server.vercel.app");
export default socket;