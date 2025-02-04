import { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from './config';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, request) {
    const url = request.url;

    if(!url) {
        ws.close();
        return;
    }

    const queryParam = new URLSearchParams(url.split('?')[1]);
    const token = queryParam.get('token') || '';
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !(decoded as JwtPayload).userId) {
        ws.close();
        return;
    }

  ws.on('message', function message(data) {
    console.log("Hello from the socket server");
  });

});