"use client";

import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SuccessEditAccount from '../../../components/SuccessEditAccount';
import ErrorEditAccount from '../../../components/ErrorEditAccount';
import DeleteAccount from '../../../components/DeleteAccount';
import SuccessDeleteAccount from '../../../components/SuccessDeleteAccount';

export default function account(){

    const router = useRouter();

    const [user, setUser] = useState(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showSuccessDelete, setShowSuccessDelete] = useState(false);

    //get user
    useEffect(() => {
        async function fetchUser() {
        const res = await fetch("/api/user");
        if (res.ok) {
            const data = await res.json();
            setUser(data);
            setName(data.name);
            setEmail(data.email);
            setPassword('');
            setConfirmPassword('');
        }
        }
        fetchUser();
    }, []);

    const signout = async () => {
        await fetch("/api/signout", {
        method: "POST",
        credentials: "include",
        });
        router.push("/");
    };

    const projects = () => {
        router.push(`/projects/${user.id}`);
    };

    // submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
        alert("Passwords don't match");
        return;
        }

        const updateData = {
            name,
            email,
            ...(password && { password }),
        };

        const res = await fetch("/api/user", {
            method: "PUT", // PUT or PATCH
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(updateData),
        });

        if (res.ok) {
            const updatedUser = await res.json();
            setUser(updatedUser);
            //alert("Profile updated!");
            setShowSuccess(true); 
            setPassword('');
            setConfirmPassword('');
        } else {
            //alert("Failed to update profile");
            setShowError(true); 
        }
    };

    const handleDeleteClick = () => {
        setShowDelete(true);
    };

    const handleCancelDelete = () => {
        setShowDelete(false);
    };

    const handleConfirmDelete = async () => {
        try {
        const res = await fetch("/api/user", {
            method: "DELETE",
            credentials: "include",
        });
        if (res.ok) {
            setShowSuccessDelete(true);
            setShowDelete(false);
        } else {
            alert("Error while deleting");
        }
        } catch (error) {
        console.error(error);
        alert("Error server");
        }
    };

    if (!user) return <p className='text-center text-2xl'>Loading...</p>;

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
            <div className='flex justify-center items-center gap-10 mt-5'>
                <button title='HOME'>
                    <Link href="/">
                        <Image
                            src="/Home.svg"
                            alt="Home"
                            width={50}
                            height={50}
                            className="w-12 md:w-18 h-auto hover:bg-bg hover:opacity-50"
                        />
                    </Link>
                </button>
                <button title='SIGN OUT' onClick={signout}>
                        <Image
                            src="/Sign.svg"
                            alt="Sign out"
                            width={50}
                            height={50}
                            className="w-12 md:w-18 h-auto hover:bg-bg hover:opacity-50"
                        />
                </button>
                <button title='PROJECTS' onClick={projects}>
                        <Image
                            src="/Projects.svg"
                            alt="Project manager"
                            width={50}
                            height={50}
                            className="w-12 md:w-18 h-auto hover:bg-bg hover:opacity-50"
                        />
                </button>
            </div>
            <form className='mt-5 flex flex-col gap-5' onSubmit={handleSubmit}>
                <div className='div-form'>
                    <label htmlFor="name" className='label-form'>Name</label>
                    <input id='name' name='name' className='input-form' type='text' value={name} onChange={(e) => setName(e.target.value)}></input>
                </div>
                <div className='div-form'>
                    <label htmlFor="email" className='label-form'>Email</label>
                    <input id='email' name='email' className='input-form' type='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                <div className='div-form'>
                    <label htmlFor="password" className='label-form'>Password</label>
                    <input id='password' name='password' className='input-form' type='password' onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <div className='div-form'>
                    <label htmlFor="confirmPassword" className='label-form'>Confirm password</label>
                    <input id='confirmPassword' name='confirmPassword' className='input-form' type='password' onChange={(e) => setConfirmPassword(e.target.value)}></input>
                </div>
                <div className='flex flex-col md:flex-row justify-center items-center mt-5 md:mt-10 gap-5 xl:gap-10 mb-5'>
                    <button className='btn-primary' type='submit'>
                        SAVE
                    </button>
                    <button className='btn-primary' type='button' onClick={handleDeleteClick}>
                        DELETE ACCOUNT
                    </button>
                </div>
            </form>
            {showSuccess && (
                <SuccessEditAccount onClose={() => setShowSuccess(false)} />
            )}
            {showError && (
                <ErrorEditAccount onClose={() => setShowError(false)} />
            )}
            {showDelete && (
                <DeleteAccount
                    email={user.email}
                    onClose={() => setShowDelete(false)}
                    onConfirm={handleConfirmDelete}
                />
            )}
            {showSuccessDelete && (
                <SuccessDeleteAccount onClose={() => {
                    setShowError(false);
                    router.push("/");
                }} />
            )}
        </div>
    )
}