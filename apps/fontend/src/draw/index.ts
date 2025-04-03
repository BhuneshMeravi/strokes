import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    };

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
  const ctx = canvas.getContext("2d");

  let existingShape: Shape[] = await getExistingShapes(roomId);

  if (!ctx) {
    return;
  }

  clearCanvas(existingShape, canvas, ctx)

  socket.onmessage = (event) =>{
    const message = JSON.parse(event.data)

    if(message.type == "chat"){
        const parsedShape = JSON.parse(message.message)
        existingShape.push(parsedShape)
        clearCanvas(existingShape, canvas, ctx)
    }
  }

  let startX = 0;
  let startY = 0;
  let clicked = false;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!clicked) return;
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    const shape: Shape = {
        type: "rect",
        x: startX,
        y: startY,
        height,
        width,
      }
    existingShape.push(shape);
    socket.send(JSON.stringify({type: "chat", message: JSON.stringify({shape}), roomId}))
    clearCanvas(existingShape, canvas, ctx)
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      
      const width = currentX - startX;
      const height = currentY - startY;

      clearCanvas(existingShape, canvas, ctx);
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}

function clearCanvas(
  existingShape: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  existingShape.map((shape) => {
    if (shape.type == "rect") {
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`)
    console.log(res.data)
    const messages = res.data.messages;

    const shapes = messages.map((x: {message: string})=>{
        const messageData = JSON.parse(x.message)
        return messageData.shape;
    })

    return shapes; 
}