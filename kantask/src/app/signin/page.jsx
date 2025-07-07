'use client'

import Image from 'next/image'
import Link from 'next/link';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function signin(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [error, setError] = useState(null);

    const handleSignin = async (e) => {
        e.preventDefault();

        try{
            const res = await fetch("/api/signin", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (res.ok) {
            router.push(`/projects/${data.user.id}`); //Connnect user and send page projects
            } else {
            setError(data.message);
            }
        }catch (err) {
            console.error("Signin error:", err);
            setError("An unexpected error occurred.");
        }
    };

    return (
        <div>
            <div className="flex justify-center items-center">
                <Link href="/">
                    <Image
                        src="/LogoKanTaskSansFond.svg"
                        alt="Logo de l'application"
                        width={500}
                        height={300}
                        className="md:w-[500px] h-auto"
                    />
                </Link>
            </div>
            <form className='mt-5 flex flex-col gap-5' onSubmit={handleSignin}>
                <div className='div-form'>
                    <label htmlFor="email" className='label-form'>Email</label>
                    <input id='email' name='email' className='input-form' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required></input>
                </div>
                <div className='div-form'>
                    <label htmlFor="password" className='label-form'>Password</label>
                    <input id='password' name='password' className='input-form' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                </div>
                <div className='flex flex-col justify-center items-center mt-5 md:mt-10 gap-3 md:gap-5'>
                    <button className='btn-primary' type='submit'>
                        SIGN IN
                    </button>
                    <p className='text-xl'>No account ? <Link href="/signup" className='underline hover:decoration-main decoration-3'>SIGN UP</Link></p>
                    {error && (
                        <p className="mt-3 text-center text-lg text-error">{error}</p>
                    )}
                </div>
            </form>            
        </div>
    )
}
