import { WebSocketServer } from "ws";
import { createServer } from "http";

const wss = new WebSocketServer({ port: 5051 });

var sockets = [];

wss.on("connection", function connection(ws) {
  sockets.push(ws);
  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.send("something");
});

const requestListener = function (req, res) {
  let slug = "";
  if (req.method === "GET" && req.url !== "/favicon.ico") {
    slug = req.url.replace("/", "");
    sockets.forEach((socket) => socket.send(slug));
  }

  res.writeHead(200);
  res.end(`sent ${slug} to ${sockets.length} web sockets`);
};

const server = createServer(requestListener);
server.listen(5050);
