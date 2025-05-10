'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Welcome from '@/component/welcome';
import ActiveChat from '@/component/activeChat';
import useSocket from '@/hooks/useSocket';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { userDataType, User, Msg } from './type';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import SendIcon from '@mui/icons-material/Send';

const Picker = dynamic(() => import('emoji-picker-react'), {
    ssr: false,
});

const ChatPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [userData, setUserData] = useState<userDataType | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [selectedUsername, setSelectedUsername] = useState<string>('');
    const [selectedUserAvatar, setSelectedUserAvatar] = useState<string>('');
    const [inputMsg, setInputMsg] = useState<string>('');
    const [msgs, setMsgs] = useState<Msg[]>([]);

    const router = useRouter();
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

    const { socket, status } = useSocket(backend_url as string); // Backend URL

    useEffect(() => {
        if (!socket || !selectedUserId) return;

        socket.on('msg-recieve', (data: { msg: string; me: string }) => {
            if (selectedUserId === data.me) {
                setMsgs((prev) => [...prev, { text: data.msg, fromSelf: false }]);
            }
        });

        return () => {
            socket.off('msg-recieve');
        };
    }, [selectedUserId, socket]);

    useEffect(() => {
        if (!socket || !userData) return;

        socket.emit('add-user', userData.id);
    }, [socket, userData]);

    const sendMessage = async () => {
        if (!selectedUserId || !userData) {
            toast.error('Pleasa select user bro :)');
            return;
        }

        if (inputMsg.trim() && socket) {
            socket.emit('send-msg', { to: selectedUserId, msg: inputMsg, me: userData.id });
            setMsgs([...msgs, { fromSelf: true, text: inputMsg }]);
        }

        try {
            const res = await axios.post(`${backend_url}/api/addMessage`, {
                from: userData.id,
                to: selectedUserId,
                text: inputMsg.trim(),
            });

            if (!res.data.status) {
                toast.error(res.data.msg);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(`catch err ${err.message}`);
                console.error(err);
            } else {
                toast.error('Unknown error occurred');
                console.error('Unknown error:', err);
            }
        } finally {
            setInputMsg('');
        }
    };

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/login');
            return;
        }
        const localData = localStorage.getItem('userData');
        if (localData) {
            const t = JSON.parse(localData);
            setUserData(t);
        }
    }, []);

    useEffect(() => {
        if (!userData) return;

        const fetchUser = async () => {
            try {
                const res = await axios.get(`${backend_url}/api/getAllUsers/${userData.id}`);
                if (!res.data.status) {
                    toast.error(res.data.msg);
                    return;
                }
                const fetchedUsers = res.data.users;
                setUsers(fetchedUsers);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    toast.error(`catch err ${err.message}`);
                    console.error(err);
                } else {
                    toast.error('Unknown error occurred');
                    console.error('Unknown error:', err);
                }
            }
        };

        fetchUser();
    }, [userData]);

    useEffect(() => {
        if (!userData || !selectedUserId) return;

        const fetchMsg = async () => {
            try {
                const res = await axios.post(`${backend_url}/api/getMessage`, {
                    from: userData.id,
                    to: selectedUserId,
                });

                if (!res.data.status) {
                    toast.error(res.data.msg);
                    return;
                }

                setMsgs(res.data.allmsg);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    toast.error(`catch err ${err.message}`);
                    console.error(err);
                } else {
                    toast.error('Unknown error occurred');
                    console.error('Unknown error:', err);
                }
            }
        };

        fetchMsg();
    }, [userData, selectedUserId]);

    const handleEmojiClick = (emojiObject: { emoji: string }) => {
        setInputMsg((prev) => prev + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    return (
        <>
            <div className="w-[100vw] h-screen max-h-[800px] bg-[#0b091a]">
                <div className="mx-auto w-screen h-full max-w-[1600px] px-[90px] relative pt-[50px]">
                    <div className="bg-[#1a1729] w-[90%] h-[92%] mx-auto rounded-[20px] flex flex-row">
                        <div className="w-[300px]">
                            <div className="flex flex-row gap-[10px] items-center justify-center mt-[20px]">
                                <Image src="/logo.svg" alt="logo" height={40} width={40} />
                                <p className="font-[700] text-[20px]">SNAPPY</p>
                            </div>
                            <div className="h-[70%] w-full overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-thin scrollbar-track-rounded-full scrollbar scrollbar-thumb-[#8750f7] scrollbar-track-[#2a1454] border-[0.5px] border-transparent border-t-violet-900 flex flex-col items-center justify-start pt-[20px] mt-[20px] gap-[10px]">
                                {users?.map((user: User, i: number) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            setSelectedUserId(user._id as string);
                                            setSelectedUserAvatar(user.avatarImage);
                                            setSelectedUsername(user.username);
                                        }}
                                        className={`flex flex-row items-center justify-start bg-[#262438] w-[90%] ${selectedUserId === user._id ? 'saturate-200' : ''} rounded-[15px] py-[10px] cursor-pointer`}
                                    >
                                        <Image
                                            src={user.avatarImage}
                                            alt="user"
                                            height={45}
                                            width={45}
                                            className="ml-[10px]"
                                        />
                                        <p className="ml-[15px] font-[700]">{user.username}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-row items-center justify-center gap-[10px] mt-[20px] relative">
                                <Image
                                    src={(userData?.avatarImage as string) || '/avatar-1.png'}
                                    alt="image"
                                    height={60}
                                    width={60}
                                />
                                <div className="font-[700]">{userData?.username}</div>
                                <div className="absolute bottom-[-20px] text-white/25 text-[14px]">
                                    {status}
                                </div>
                            </div>
                        </div>
                        <div className="bg-black w-full h-full rounded-[20px]">
                            {selectedUserId ? (
                                <div className="w-full h-full flex flex-col items-center justify-center">
                                    <ActiveChat
                                        username={selectedUsername}
                                        avatar={selectedUserAvatar}
                                        msgs={msgs}
                                    />
                                    <div className="bg-[#1B1A22] w-full h-[15%] flex flex-row items-center justify-center gap-[20px] pb-[10px] relative">
                                        <div
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className="text-sky-500 cursor-pointer"
                                        >
                                            <AddReactionIcon sx={{ fontSize: '30px' }} />
                                        </div>
                                        {showEmojiPicker && (
                                            <div className="absolute top-[-300px] left-[150px]">
                                                <Picker
                                                    onEmojiClick={handleEmojiClick}
                                                    style={{
                                                        backgroundColor: '#1a1729',
                                                        width: '250px',
                                                        height: '400px',
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <input
                                            type="text"
                                            className="w-[85%] font-[500] bg-[#262438] h-[50%] rounded-[20px] focus:outline-none px-[20px] py-[10px]"
                                            onChange={(e) => setInputMsg(e.target.value)}
                                            value={inputMsg}
                                            placeholder="Type your message here"
                                        />
                                        <span
                                            onClick={sendMessage}
                                            className="absolute bg-violet-400 py-[6px] px-[25px] cursor-pointer hover:bg-violet-500 rounded-[20px] right-[5%]"
                                        >
                                            <SendIcon sx={{ fontSize: '30px' }} />
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <Welcome name={userData?.username as string} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatPage;
