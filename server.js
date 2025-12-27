import WebSocket from "ws";

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });
const rooms = {};

wss.on("connection", ws => {
  ws.on("message", msg => {
    const data = JSON.parse(msg);

    if (data.join) {
      ws.room = data.join;
      rooms[ws.room] = rooms[ws.room] || [];
      rooms[ws.room].push(ws);
    }

    ["offer", "answer", "ice"].forEach(type => {
      if (data[type]) {
        rooms[ws.room].forEach(client => {
          if (client !== ws) {
            client.send(JSON.stringify({ [type]: data[type] }));
          }
        });
      }
    });
  });
});
