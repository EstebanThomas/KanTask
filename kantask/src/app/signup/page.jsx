"use client";

import Image from 'next/image'
import Link from 'next/link';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function signup(){
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const router = useRouter();

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage(data.message);
            setFormData({ name: "", email: "", password: "" }); // reset form
            router.push(`/projects/${data.user.id}`); //Connnect user and send page projects
        } else {
            setMessage(data.message || "An error has occurred");
        }
        } catch (error) {
        console.error("Error :", error);
        setMessage("Server connection error");
        }
    };

    //HTML
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
                        priority
                    />
                </Link>
            </div>
            <form className='mt-5 flex flex-col gap-5' onSubmit={handleSubmit}>
                <div className='div-form'>
                    <label htmlFor="name" className='label-form'>Name</label>
                    <input id='name' name='name' className='input-form' type='text' value={formData.name} onChange={handleChange} required></input>
                </div>
                <div className='div-form'>
                    <label htmlFor="email" className='label-form'>Email</label>
                    <input id='email' name='email' className='input-form' type='email' value={formData.email} onChange={handleChange} required></input>
                </div>
                <div className='div-form'>
                    <label htmlFor="password" className='label-form'>Password</label>
                    <input id='password' name='password' className='input-form' type='password' value={formData.password} onChange={handleChange} required></input>
                </div>
                <div className='div-form'>
                    <label htmlFor="confirmPassword" className='label-form'>Confirm password</label>
                    <input id='confirmPassword' name='confirmPassword' className='input-form' type='password'></input>
                </div>
                <div className='flex flex-col justify-center items-center mt-5 md:mt-10 gap-3 md:gap-5 mb-5'>
                    <button className='btn-primary' type='submit'>
                        SIGN UP
                    </button>
                    <p className='text-xl'>Have an account ? <Link href="/signin" className='underline hover:decoration-main decoration-3'>SIGN IN</Link></p>
                </div>
                {message && (
                    <p className="mt-3 text-center text-lg text-error">{message}</p>
                )}
            </form>
            
        </div>
    )
}
