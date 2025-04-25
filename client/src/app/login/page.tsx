'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { akaya } from '../font'
import toast from 'react-hot-toast'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios'


const Login: React.FC = () => {

    const router = useRouter()
    const [pass_visible, setPass_visible] = useState<boolean>(true)
    const [formData, setFormData] = useState<{ email: string; password: string }>({ email: "", password: "" })
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if (localStorage.getItem("token")) {
            router.push("/")
        }
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (!formData.email || !formData.password) {
                toast.error(<div className={`${akaya.className} text-[20px]`}>Please fill all field</div>)
                return;
            }

            setIsLoading(true)
            console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, formData)
            setIsLoading(false)
            if (!res.data.status) {
                toast.error(res.data.msg)
                return;
            }

            localStorage.setItem("token", res.data.token)
            localStorage.setItem("userData", JSON.stringify(res.data.userData))
            toast.success(res.data.msg)
            router.push('/')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            <div className='w-[100vw] pb-[50px] bg-[#0b091a] py-[150px] h-[100vh] max-h-[1000px]'>
                <div className='bg-black font-[500] px-[100px] mx-auto w-[450px] py-[30px] relative rounded-[30px] flex flex-col items-center justify-center gap-[30px]'>
                    <h1 className='flex flex-row items-center justify-center gap-[30px]'>
                        <div className="h-[70px] w-[70px]">
                            <Image
                                src="/logo.svg"
                                alt="logo"
                                height={100}
                                width={100}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className='font-[700] text-[25px]'>Login</p>
                    </h1>
                    <form >
                        <input
                            type="text"
                            required
                            placeholder='Email'
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-transparent border-[2px] border-[#2a1454] focus:border-pink-500/70 focus:outline focus:outline-pink-500/70 placeholder:text-joke/50 text-joke rounded-[6px] px-[20px] py-[8px] w-[100%]"
                        />
                        <input
                            type={`${pass_visible ? "text" : "password"}`}
                            required
                            placeholder='Password'
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="bg-transparent border-[2px] mt-[20px] border-[#2a1454] focus:border-pink-500/70 focus:outline focus:outline-pink-500/70 placeholder:text-joke/50 text-joke rounded-[6px] px-[20px] py-[8px] w-[100%]"
                        />
                        <div onClick={() => setPass_visible(!pass_visible)} className='translate-x-[210px] translate-y-[-35px] text-pink-500 cursor-pointer absolute'>
                            {pass_visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </div>
                        <input
                            type="button"
                            value={isLoading ? "...loading" : "Login"}
                            onClick={handleLogin}
                            className="text-white/70 font-[700] rounded-[20px] px-[25px] py-[10px] mt-[20px] cursor-pointer capitalize bg-gradient-to-r from-[#9500ff] via-[#2a1454] to-[#9500ff] bg-[length:300%] transition-all duration-700 hover:bg-right w-[100%]"
                        />
                    </form>
                    <div className={`${akaya.className} text-nowrap text-[20px]`}>
                        Don't have an account ? <span onClick={() => router.push("/signup")} className='text-joke cursor-pointer'> Register</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;