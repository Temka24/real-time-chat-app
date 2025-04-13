import { model, models, Document, Schema } from "mongoose";

export interface IUser extends Document{
    username: string;
    email: string;
    password: string;
    avatarImage: string;
}

const userSchema: Schema = new Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatarImage: {
        type: String,
        required: true
    }
})

export default models.User || model<IUser>('User', userSchema)