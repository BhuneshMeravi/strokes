import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket(){ 
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjZjJjM2RiMi1jOWIzLTRhNWItODA5MS1jNWRiZjc1ZTc5ZDkiLCJpYXQiOjE3NDEwMzAwOTl9.V5cA3mOVdbmm0Fx95Cz3XA7TAI5YqM1PiB9CqRAjnYI`);
        ws.onopen = () => {
            setLoading(false)
            setSocket(ws)
        }
    }, [])

    return {
        socket,
        loading
    }
}