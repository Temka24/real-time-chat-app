import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IMessage extends Document {
    text: string;
    users: Array<string>;
    sender: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const MsgSchema: Schema = new Schema<IMessage>({
    text: {
        type: String,
        required: true
    },
    users: [{ type: String }],
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

export default models.Message || model("Message", MsgSchema);