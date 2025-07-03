import Image from 'next/image'
import Link from 'next/link';

export default function account(){
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
                <button title='SIGN OUT'>
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
                <button title='MODIFY PROFILE'>
                    <Link href="/">
                        <Image
                            src="/User.svg"
                            alt="Modify profile"
                            width={50}
                            height={50}
                            className="w-12 md:w-18 h-auto hover:bg-bg hover:opacity-50"
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
                            className="w-12 md:w-18 h-auto hover:bg-bg hover:opacity-50"
                        />
                    </Link>
                </button>
            </div>
            <form className='mt-5 flex flex-col gap-5'>
                <div className='div-form'>
                    <label htmlFor="name" className='label-form'>Name</label>
                    <input id='name' name='name' className='input-form' type='text'></input>
                </div>
                <div className='div-form'>
                    <label htmlFor="email" className='label-form'>Email</label>
                    <input id='email' name='email' className='input-form' type='email'></input>
                </div>
                <div className='div-form'>
                    <label htmlFor="password" className='label-form'>Password</label>
                    <input id='password' name='password' className='input-form' type='password'></input>
                </div>
                <div className='div-form'>
                    <label htmlFor="confirmPassword" className='label-form'>Confirm password</label>
                    <input id='confirmPassword' name='confirmPassword' className='input-form' type='password'></input>
                </div>
                <div className='flex flex-col md:flex-row justify-center items-center mt-5 md:mt-10 gap-5 xl:gap-10 mb-5'>
                    <button className='btn-primary' type='submit'>
                        SAVE
                    </button>
                    <button className='btn-primary' type='submit'>
                        DELETE ACCOUNT
                    </button>
                </div>
            </form>
            
        </div>
    )
}
