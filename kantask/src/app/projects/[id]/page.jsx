'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link';
import EditProjectPopup from '../../../components/EditProject';
import DeleteProjectPopup from '../../../components/DeleteProject';


export default function projects(){

    const [user, setUser] = useState({});
    const router = useRouter();

    useEffect(() => {
        const fetchUserAndProjects = async () => {
            try {
                const resUser = await fetch("/api/user", { credentials: "include" });
                if (resUser.ok) {
                    const dataUser = await resUser.json();
                    setUser(dataUser);

                    const resProjects = await fetch(`/api/projects/user/${dataUser.id}`);
                    if (resProjects.ok) {
                        const dataProjects = await resProjects.json();
                        setProjects(dataProjects);
                    } else {
                        console.error("Failed to fetch projects");
                    }
                } else {
                    console.error("Failed to fetch user");
                    router.push("/");
                }
            } catch (error) {
                console.error("Error fetching user or projects:", error);
                router.push("/");
            }
        };

        fetchUserAndProjects();
    }, []);

    const [projects, setProjects] = useState([])
    const [editingProject, setEditingProject] = useState(null)
    const [newTitle, setNewTitle] = useState('')
    const [projectToDelete, setProjectToDelete] = useState(null);
    const handleProjectClick = (id) => {
        router.push(`/project/${id}`);
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch(`/api/projects/user/${user.id}`);
            if (res.ok) {
                const dataProjects = await res.json();
                setProjects(dataProjects);
            } else {
                console.error("Failed to fetch projects");
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const AddProject = async () => {
        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "New Project", userId: user.id }),
            });

            if (res.ok) {
                await fetchProjects();
            } else {
                console.error("Failed to create project");
            }
        } catch (err) {
            console.error("Error creating project:", err);
        }
    };

    const DeleteProject = (id) => {
        setProjects(projects.filter(project => project.id !== id))
    }

    const StartEdit = (project) => {
        setEditingProject(project)
        setNewTitle(project.title)
    }

    const ConfirmEdit = async (title) => {
        try {
            await fetch(`/api/projects/${editingProject.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: title }),
            });

            await fetchProjects();
            setEditingProject(null);
        } catch (err) {
            console.error("Error renaming project:", err);
        }
    };

    const CancelEdit = () => {
        setEditingProject(null)
    }

    const StartDelete = (project) => {
        setProjectToDelete(project);
    };

    const ConfirmDelete = async () => {
        try {
            await fetch(`/api/projects/${projectToDelete.id}`, {
                method: "DELETE",
            });
            await fetchProjects();
            setProjectToDelete(null);
        } catch (err) {
            console.error("Error deleting project:", err);
        }
    };

    const CancelDelete = () => {
        setProjectToDelete(null);
    };

    const handleSignout = async () => {
        await fetch("/api/signout", {
            method: "POST",
            credentials: "include",
        });
        router.push("/");
    };

    const account = () => {
        router.push(`/account/${user.id}`);
    };

    if (!user.name) return <p className='flex justify-center items-center text-2xl'>Loading user...</p>;

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
            <h1 className='text-center m-2'>{user.email}</h1>
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
                <button title='SIGN OUT' onClick={handleSignout}>
                    <Link href="/">
                        <Image
                            src="/Sign.svg"
                            alt="Sign out"
                            width={50}
                            height={50}
                            className="w-12 md:w-18 h-auto hover:bg-bg hover:opacity-50"
                        />
                    </Link>
                </button>
                <button title='ACCOUNT' onClick={account}>
                        <Image
                            src="/User.svg"
                            alt="Modify account"
                            width={50}
                            height={50}
                            className="w-12 md:w-18 h-auto hover:bg-bg hover:opacity-50"
                        />
                </button>
            </div>
            <div className='flex justify-center items-center mt-10'>
                <button title='CREATE PROJECT' onClick={AddProject}>
                    <Image
                        src="/Add.svg"
                        alt="Create project"
                        width={50}
                        height={50}
                        className="w-12 md:w-18 h-auto hover:bg-bg hover:opacity-50"
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
                                className="w-12 md:w-15 h-auto hover:bg-primary hover:opacity-65"
                            />
                        </button>
                        <button title='EDIT PROJECT' className='absolute top-0 right-0' onClick={() => StartEdit(project)}>
                            <Image
                                src="/Edit.svg"
                                alt="Delete project"
                                width={50}
                                height={50}
                                className="w-11 md:w-14 h-auto hover:bg-primary hover:opacity-65"
                            />
                        </button>
                        <div className='absolute top-4/7 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-auto max-w-full max-h-full whitespace-nowrap p-2'>
                            <h1 onClick={() => handleProjectClick(project.id)} className='hover:decoration-2 hover:underline underline-offset-3 decoration-black hover:font-bold hover:text-black'>{project.title}</h1>
                        </div>
                    </div>
                ))}
            </div>
            {editingProject && (
                <EditProjectPopup
                    currentTitle={editingProject.title}
                    onClose={CancelEdit}
                    onSave={async (title) => {
                        await ConfirmEdit(title);
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