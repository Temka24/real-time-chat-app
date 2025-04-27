'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { akaya } from '../font';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const Signup: React.FC = () => {
    const router = useRouter();
    const avatarUrls: string[] = [
        '/avatar-1.png',
        '/avatar-2.png',
        '/avatar-3.png',
        '/avatar-4.png',
    ];

    const [isOpenSetAvatar, setIsOpenSetAvatar] = useState<boolean>(false);
    const [formData, setFormData] = useState<{
        username: string;
        email: string;
        password: string;
        avatarImage: string;
    }>({ username: '', email: '', password: '', avatarImage: '' });
    const [confirmPass, setConfirmPass] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [pass_1_visible, setPass_1_visible] = useState<boolean>(true);
    const [pass_2_visible, setPass_2_visible] = useState<boolean>(true);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            router.push('/');
        }
    }, []);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const res = await axios.post(`${backend_url}/api/register` as string, formData);
            setIsLoading(false);
            if (!res.data.status) {
                toast.error(res.data.msg);
                return;
            }
            if (res.data.status) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userData', JSON.stringify(res.data.userData));
                toast.success(res.data.msg);
                router.push('/');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenAvatar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password) {
            toast.error(
                <div className={`${akaya.className} text-[20px]`}>Please fill the all field</div>,
            );
            return;
        }
        if (formData.password !== confirmPass) {
            toast.error('Please check your password');
            return;
        }
        setIsOpenSetAvatar(true);
    };

    return (
        <>
            <div className="w-screen pb-[50px] bg-[#0b091a] py-[100px] h-screen max-h-[1000px]">
                {isOpenSetAvatar ? (
                    <div className="font-[500] px-[100px] mx-auto w-[450px] py-[50px] mt-[100px] relative rounded-[30px] flex flex-col items-center justify-center gap-[40px]">
                        <p className="text-nowrap text-[24px]">
                            Pick an avatar as your profile picture
                        </p>
                        <div className="flex flex-row items-center justify-center gap-[40px]">
                            {avatarUrls.map((avtar, i) => (
                                <div
                                    key={i}
                                    onClick={() => setFormData({ ...formData, avatarImage: avtar })}
                                    className={`h-[80px] w-[80px] ${formData.avatarImage === avtar && 'border border-[5px] border-pink-500 rounded-full'}`}
                                >
                                    <Image
                                        src={avtar}
                                        alt="logo"
                                        height={100}
                                        width={100}
                                        className="w-full h-full object-cover cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleSignUp}
                            className={`${akaya.className} text-[20px] text-white/70 font-[700] rounded-[5px] px-[25px] text-nowrap py-[10px] mt-[20px] cursor-pointer capitalize bg-gradient-to-r from-[#9500ff] via-[#2a1454] to-[#9500ff] bg-[length:300%] cursor-pointer transition-all duration-700 hover:bg-right w-[100%]`}
                        >
                            {isLoading ? '...loading' : 'SET AS PROFILE PICTURE'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-black font-[500] px-[100px] mx-auto w-[450px] py-[50px] relative rounded-[30px] flex flex-col items-center justify-center gap-[30px]">
                        <h1 className="flex flex-row items-center justify-center gap-[30px]">
                            <Image src="/logo.svg" alt="logo" height={70} width={70} />
                            <p className="font-[700] text-[25px]">Sign up</p>
                        </h1>
                        <form>
                            <input
                                type="text"
                                placeholder="Username"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                className="bg-transparent border border-[2px] border-[#2a1454] focus:border-pink-500/70 focus:outline focus:outline-pink-500/70 placeholder:text-joke/50 text-joke rounded-[6px] px-[20px] py-[8px] w-[100%]"
                            />
                            <input
                                type="text"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                className="bg-transparent border border-[2px] mt-[20px] border-[#2a1454] focus:border-pink-500/70 focus:outline focus:outline-pink-500/70 placeholder:text-joke/50 text-joke rounded-[6px] px-[20px] py-[8px] w-[100%]"
                            />
                            <input
                                type={`${pass_1_visible ? 'text' : 'password'}`}
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                className="bg-transparent border border-[2px] mt-[20px] border-[#2a1454] focus:border-pink-500/70 focus:outline focus:outline-pink-500/70 placeholder:text-joke/50 text-joke rounded-[6px] px-[20px] py-[8px] w-[100%]"
                            />
                            <div
                                onClick={() => setPass_1_visible(!pass_1_visible)}
                                className="translate-x-[210px] translate-y-[-35px] text-pink-500 cursor-pointer absolute"
                            >
                                {pass_1_visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </div>
                            <input
                                type={`${pass_2_visible ? 'text' : 'password'}`}
                                placeholder="Confirm Password"
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                className="bg-transparent border border-[2px] mt-[20px] border-[#2a1454] focus:border-pink-500/70 focus:outline focus:outline-pink-500/70 placeholder:text-joke/50 text-joke rounded-[6px] px-[20px] py-[8px] w-[100%]"
                            />
                            <div
                                onClick={() => setPass_2_visible(!pass_2_visible)}
                                className="translate-x-[210px] translate-y-[-35px] text-pink-500 cursor-pointer absolute"
                            >
                                {pass_2_visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </div>
                            <button
                                onClick={handleOpenAvatar}
                                className="text-white/70 font-[700] rounded-[20px] px-[25px] py-[10px] mt-[20px] cursor-pointer capitalize bg-gradient-to-r from-[#9500ff] via-[#2a1454] to-[#9500ff] bg-[length:300%] cursor-pointer transition-all duration-700 hover:bg-right w-[100%]"
                            >
                                Sign up
                            </button>
                        </form>
                        <div className={`${akaya.className} text-nowrap text-[20px]`}>
                            Already have an account ?{' '}
                            <span
                                onClick={() => router.push('/login')}
                                className="text-joke cursor-pointer"
                            >
                                {' '}
                                Login
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Signup;
