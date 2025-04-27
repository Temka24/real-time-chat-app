import React from 'react';
import Image from 'next/image';
import { akaya, roboto } from '@/app/font';

const Welcome: React.FC<{ name: string }> = ({ name }) => {
    return (
        <>
            <div className="w-full h-full flex flex-col items-center justify-center gap-[10px]">
                <Image src="/robot.gif" alt="robot" height={300} width={300} unoptimized />
                <div className="font-[700]">
                    <p className={`${akaya.className} text-[26px] text-center`}>
                        Welcome{' '}
                        <span className={`text-violet-500 font-[700] ${roboto.className}`}>
                            {name}
                        </span>
                    </p>
                    <p className="text-[20px]">Please select a chat to Start Messaging !</p>
                </div>
            </div>
        </>
    );
};

export default Welcome;
