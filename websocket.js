import { WebSocketServer } from "ws";

export const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("OBS connected to WebSocket");

  ws.on("close", () => {
    console.log("OBS disconnected");
  });
});
