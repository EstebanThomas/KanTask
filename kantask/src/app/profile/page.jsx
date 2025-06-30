'use client'

import Image from 'next/image'
import Link from 'next/link';
import { useState } from 'react'

export default function signup(){

    const [projects, setProjects] = useState([])

    const AddProject = () => {
        setProjects([...projects, { id: Date.now(), title: 'TITLE' }])
    }

    const DeleteProject = (id) => {
        setProjects(projects.filter(project => project.id !== id))
    }

    return (
        <div>
            <div className="flex justify-center items-center">
                <Link href="/">
                    <Image
                        src="/LogoKanTaskSansFond.svg"
                        alt="Logo de l'application"
                        width={500}
                        height={300}
                        className="w-70 md:w-100 h-auto"
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
                            className="w-12 md:w-18 h-auto"
                        />
                    </Link>
                </button>
                <button title='SIGN OUT'>
                    <Link href="/">
                        <Image
                            src="/Sign.svg"
                            alt="Sign out"
                            width={50}
                            height={50}
                            className="w-12 md:w-18 h-auto"
                        />
                    </Link>
                </button>
                <button title='MODIFY PROFILE'>
                    <Link href="/">
                        <Image
                            src="/User.svg"
                            alt="Modify profile"
                            width={50}
                            height={50}
                            className="w-12 md:w-18 h-auto"
                        />
                    </Link>
                </button>
            </div>
            <div className='flex justify-center items-center mt-10'>
                <button title='CREATE PROJECT' onClick={AddProject}>
                    <Image
                        src="/Add.svg"
                        alt="Create project"
                        width={50}
                        height={50}
                        className="w-12 md:w-18 h-auto"
                    />
                </button>                
            </div>
            <div id='projects' className='flex flex-col justify-center items-center gap-5 mt-5'>

                {projects.map((project) => (
                    <div key={project.id} className='btn-project relative w-70 h-30 md:w-125 md:h-40'>
                        <button title='DELETE PROJECT' className='absolute top-0 left-0' onClick={() => DeleteProject(project.id)}>
                            <Image
                                src="/Close.svg"
                                alt="Delete project"
                                width={50}
                                height={50}
                                className="w-12 md:w-15 h-auto"
                            />
                        </button>
                        <button title='EDIT PROJECT' className='absolute top-0 right-0'>
                            <Image
                                src="/Edit.svg"
                                alt="Delete project"
                                width={50}
                                height={50}
                                className="w-11 md:w-14 h-auto"
                            />
                        </button>
                        <div className='absolute top-4/7 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-auto max-w-full max-h-full whitespace-nowrap p-2'>
                            <h1><a id='projectTitle'>{project.title}</a></h1>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}