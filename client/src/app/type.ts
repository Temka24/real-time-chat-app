export type userDataType = {
    id: string;
    username: string;
    email: string;
    avatarImage: string;
}

export type Msg = {
    text: string;
    fromSelf: boolean;
}

export type User = {
    username: string;
    avatarImage: string;
    _id: string;
}