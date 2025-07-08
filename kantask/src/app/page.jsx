"use client";

import Image from 'next/image'
import Link from 'next/link';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home(){

    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
        const res = await fetch("/api/user");
        if (res.ok) {
            const data = await res.json();
            setUser(data);
        } else {
            setUser(null);
        }
        }
        fetchUser();
    }, []);

    const goToProjects = () => {
        if (user) {
            router.push(`/projects/${user.id}`);
        }
    };

    return (
        <main className="">
            <div  className="flex justify-center items-center">
                <Image
                    src="/LogoKanTaskSansFond.svg"
                    alt="Logo de l'application"
                    width={500}
                    height={300}
                    priority
                />
            </div>
            <div className="text-center lg:grid lg:grid-cols-8 lg:grid-row-2 mt-5 whitespace-nowrap">
                <h1 className="col-start-4">Parce que chaque{' '}<span className='title-effect'>tâche</span></h1>
                <h1 className="col-start-5 row-start-2">mérite sa{' '}<span className='title-effect'>place</span></h1>
            </div>
            {user && (
                <div className='flex justify-center items-center mt-5'>
                    <button
                    onClick={goToProjects}
                    className="btn-primary"
                    title="Go to my account"
                    >
                    MY ACCOUNT
                    </button>
                </div>
                )}
            <p className="text-center text-2xl max-w-3xl mx-auto leading-relaxed mt-5">
                Kantask est une application web intuitive de gestion de tâches, pensée pour allier{' '}
                <strong>clarté</strong>,{' '}
                <strong>simplicité</strong>{' '}
                et <strong>efficacité</strong>{' '}
                au quotidien.
            </p>
            <div className='flex justify-center items-center gap-15 md:gap-50 mt-10'>
                <Link href="/signin">
                    <button className='btn-primary'>SIGN IN</button>
                </Link>
                <Link href="/signup">
                    <button className='btn-primary'>SIGN UP</button>
                </Link>
            </div>
            <div className='flex flex-col md:flex-row justify-center items-center mt-10 gap-10'>
                <div className='relative'>
                    <Image
                        src="/peopleMeeting.jpg"
                        alt="Photo d'une équipe colaborant main dans la main"
                        width= {400}
                        height={300}
                        className='rounded-lg object-cover'
                        priority
                    />
                    <Image
                        src="/LogoKanTaskSansFond.svg"
                        alt="Logo de l'application"
                        width={400}
                        height={300}
                        className='absolute rounded-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 img-logo'
                        priority
                    />
                </div>
                <p className='text-center text-2xl max-w-sm leading-relaxed'>
                    Elle vous aide à {' '}
                    <strong>organiser</strong> {' '}
                    vos idées,{' '}
                    <strong>prioriser</strong> {' '}
                    vos actions et avancer sereinement, seul ou en équipe.
                </p>
            </div>
        </main>
    )
}