'use client'

import Image from 'next/image'
import Link from 'next/link';
import { useState } from 'react'
import EditProjectPopup from '../../components/EditProject';
import DeleteProjectPopup from '../../components/DeleteProject';




export default function signup(){

    const [projects, setProjects] = useState([])
    const [editingProject, setEditingProject] = useState(null)
    const [newTitle, setNewTitle] = useState('')
    const [projectToDelete, setProjectToDelete] = useState(null);

    const AddProject = () => {
        setProjects([...projects, { id: Date.now(), title: 'TITLE' }])
    }

    const DeleteProject = (id) => {
        setProjects(projects.filter(project => project.id !== id))
    }

    const StartEdit = (project) => {
        setEditingProject(project)
        setNewTitle(project.title)
    }

    const ConfirmEdit = () => {
        setProjects(projects.map(p =>
            p.id === editingProject.id ? { ...p, title: newTitle } : p
        ))
        setEditingProject(null)
    }

    const CancelEdit = () => {
        setEditingProject(null)
    }

    const StartDelete = (project) => {
        setProjectToDelete(project);
    };

    const ConfirmDelete = () => {
        DeleteProject(projectToDelete.id);
        setProjectToDelete(null);
    };

    const CancelDelete = () => {
        setProjectToDelete(null);
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
                        priority
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
            <div id='projects' className='flex flex-col justify-center items-center gap-5 mt-5 mb-5 xl:grid xl:grid-cols-2 xl:justify-items-center 3xl:ml-50 3xl:mr-50 3xl:gap-7'>
                {projects.map((project) => (
                    <div key={project.id} className='btn-project relative w-70 md:w-125 xl:w-150 2xl:w-175 h-30  md:h-40'>
                        <button title='DELETE PROJECT' className='absolute top-0 left-0' onClick={() => StartDelete(project)}>
                            <Image
                                src="/Close.svg"
                                alt="Delete project"
                                width={50}
                                height={50}
                                className="w-12 md:w-15 h-auto"
                            />
                        </button>
                        <button title='EDIT PROJECT' className='absolute top-0 right-0' onClick={() => StartEdit(project)}>
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
            {editingProject && (
                <EditProjectPopup
                    currentTitle={editingProject.title}
                    onClose={CancelEdit}
                    onSave={(title) => {
                    setProjects(projects.map(p =>
                        p.id === editingProject.id ? { ...p, title } : p
                    ));
                    setEditingProject(null);
                    }}
                />
                )}
            {projectToDelete && (
                <DeleteProjectPopup
                    onClose={CancelDelete}
                    onConfirm={ConfirmDelete}
                    projectTitle={projectToDelete.title}
                />
            )}
        </div>
    )
}