"use client"
import React, { useEffect, useRef } from "react";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Image from "next/image";
import { Msg } from "@/app/type";
import { useRouter } from "next/navigation";

const ActiveChat: React.FC<{ username: string; avatar: string, msgs: Msg[] }> = ({ username, avatar, msgs }) => {

    const scrollRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [msgs]);

    const handleLogOut = () => {
        localStorage.clear();
        router.push("/login")
    }


    return (
        <>
            <div className="h-[85%] w-full pt-[20px] px-[40px]">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-[20px] justify-center ">
                        <Image
                            src={avatar}
                            alt="avatar"
                            height={50}
                            width={50}
                        />
                        <p className="text-[20px] font-[700]">{username}</p>
                    </div>
                    <div onClick={handleLogOut} className="text-white bg-violet-400 p-[7px] rounded-[10px] cursor-pointer"><ExitToAppIcon sx={{ fontSize: "30px" }} /></div>
                </div>
                <div ref={scrollRef} className="flex flex-col justify-start gap-[10px] mt-[30px] overflow-y-scroll pb-[100px] h-full scrollbar-none">
                    {
                        msgs.map((msg: { text: string, fromSelf: boolean }, i: number) =>
                            <div className={`chat ${msg.fromSelf ? "chat-end ml-[30px]" : "chat-start"}`} key={i}>
                                <div className={`chat-bubble ${msg.fromSelf ? "bg-violet-500" : "bg-pink-500"} rounded-[20px] font-[500] max-w-[250px] text-wrap`}>{msg.text}</div>
                            </div>)
                    }
                </div>
            </div>
        </>
    )
}

export default ActiveChat;