"use client"

import { useEffect, useRef } from "react";

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(()=> {
        if(canvasRef.current){
            const canvas =  canvasRef.current 
            const ctx = canvas.getContext("2d")

            if(!ctx){
                return
            }

            let startX = 0;
            let startY = 0;
            let clicked = false;

            addEventListener("mousedown", (e)=> {
                clicked = true;
                startX = e.clientX;
                startY= e.clientY;
            })

            addEventListener("mouseup", (e)=> {
                clicked = false;
                startX = e.clientX;
                startY= e.clientY;
            })

            addEventListener("mousemove", (e)=> {
                if(clicked){
                    const width = e.clientX - startX;
                    const height = e.clientY - startY;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.strokeRect(startX, startY, width, height)

                }
            })

            
        }
    })

    return <div>
        <canvas ref={canvasRef} height={500} width={500}></canvas>
    </div>
}