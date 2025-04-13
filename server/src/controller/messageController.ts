import { Request, Response, NextFunction } from "express";
import Message from "../model/MessageModel";
import { IMessage } from "../model/MessageModel";

export const getMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { from, to } = req.body;

        if (!from || !to) {
            res.json({ msg: "All input required", status: false })
            return;
        }

        const messages: IMessage[] = await Message.find({
            users: {
                $all: [from, to]
            }
        }).sort({ createdAt: 1 })

        if (!messages) {
            res.json({ msg: "messages not found", status: false })
            return;
        }

        const projectedMsg = messages.map((message: IMessage) => {
            return {
                fromSelf: message.sender.toString() === from,
                text: message.text
            }
        })

        if (!projectedMsg) {
            res.json({ msg: "projected msg failed", status: false })
            return;
        }

        res.json({ msg: "Success to get msg", status: true, allmsg: projectedMsg })


    } catch (err) {
        next(err)
    }
}

export const addMessage = async (req: Request, res: Response, next: NextFunction) => {
    const { from, to, text } = req.body;

    if (!from || !to || !text) {
        res.json({ msg: "All input required bro", status: false })
        return;
    }

    const newMsg = new Message({
        text,
        users: [from, to],
        sender: from
    })

    await newMsg.save()
    res.json({ msg: "Success to saved", status: true })
}