import Image from 'next/image'
import Link from 'next/link';

export default function project(){
    return (
        <div className='flex flex-col h-screen'>
            <div className='flex flex-col md:flex-row gap-0 md:gap-5'>
                <div className="flex justify-center md:justify-start items-center">
                    <Link href="/">
                        <Image
                            src="/LogoKanTaskSansFond.svg"
                            alt="Logo de l'application"
                            width={500}
                            height={300}
                            priority
                            className="w-50 md:w-75 xl:w-80 h-auto"
                        />
                    </Link>
                </div>
                <div className='flex flex-1 justify-center items-center gap-10 mt-5'>
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
                    <button title='ACCOUNT'>
                        <Link href="/account">
                            <Image
                                src="/User.svg"
                                alt="Modify account"
                                width={50}
                                height={50}
                                className="w-12 md:w-18 h-auto"
                            />
                        </Link>
                    </button>
                    <button title='PROJECTS'>
                        <Link href="/projects">
                            <Image
                                src="/Projects.svg"
                                alt="Project manager"
                                width={50}
                                height={50}
                                className="w-12 md:w-18 h-auto"
                            />
                        </Link>
                    </button>
                </div>
            </div>
            <div id='board' className='board flex-1'>

            </div>
        </div>
    )
}