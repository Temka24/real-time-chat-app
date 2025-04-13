import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketStatus = 'connected' | 'disconnected' | 'error';

const useSocket = (url: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [status, setStatus] = useState<SocketStatus>('disconnected');


    useEffect(() => {
        const socketIo = io(url, {
            reconnection: true,
            transports: ['websocket'],
        });

        socketIo.on('connect', () => {
            setStatus('connected');
            setSocket(socketIo);
        });

        socketIo.on('disconnect', () => {
            setStatus('disconnected');
            setSocket(null);
        });

        socketIo.on('connect_error', (err) => {
            setStatus('error');
            console.error('Холболтын алдаа:', err.message);
        });

        return () => {
            socketIo.disconnect();
        };
    }, [url]);

    return { socket, status };
};

export default useSocket;