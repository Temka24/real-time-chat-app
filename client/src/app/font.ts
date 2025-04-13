import { Roboto, Akaya_Kanadaka } from 'next/font/google';

export const roboto = Roboto({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '700']
})

export const akaya = Akaya_Kanadaka({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400']
})