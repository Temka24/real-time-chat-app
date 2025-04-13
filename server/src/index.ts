import express, { Express, Response } from 'express';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import connectToDatabase from './lib/mongodb';
import { errorHandler } from './middleware/errorHandler';
import allRouter from './routes/allRoutes';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get('/ping', (_, res: Response) => {
    res.json({ message: 'Welcome to TypeScript Express API!' });
});

app.use("/api", allRouter)
app.use(errorHandler)


const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectToDatabase(); // Эхлээд DB холбогдоно
    const server = app.listen(PORT, () => {
        console.log(`Server started on ${PORT}`);
    });

    const io: Server = new Server(server, {
        cors: {
            origin: '*',
            credentials: true,
        },
    });

    type UserMap = Map<string, string>;
    const onlineUsers: UserMap = new Map<string, string>();

    io.on('connection', (socket: Socket) => {

        socket.on('add-user', (userId: string) => {
            onlineUsers.set(userId, socket.id);
            console.log(`User ${userId} added with socket ${socket.id}`);
        });

        socket.on('send-msg', (data: { to: string; msg: string; me: string }) => {
            const sendUserSocket = onlineUsers.get(data.to);
            if (sendUserSocket) {
                socket.to(sendUserSocket).emit('msg-recieve', { msg: data.msg, me: data.me });
                console.log("recieved")
            }
        });

        socket.on("get-all-online-users", () => {
            const onlineUsersList = Array.from(onlineUsers.entries()).map(
                ([userId, socketId]) => ({ userId, socketId })
            );
            console.log(onlineUsersList)
        });

        socket.on('disconnect', () => {
            onlineUsers.forEach((socketId, userId) => {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    console.log(`User disconnected: ${socket.id} userId: ${userId}`);
                }
            });

        });
    });
};

const main = async () => {
    try {
        await startServer();
    } catch (err) {
        console.error('Server failed to start:', err);
    }
};

main();
