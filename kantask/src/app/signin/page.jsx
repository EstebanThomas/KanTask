import Image from 'next/image'
import Link from 'next/link';

export default function signin(){
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
            <form className='mt-5 flex flex-col gap-5'>
                <div className='div-form'>
                    <label htmlFor="email" className='label-form'>Email</label>
                    <input id='email' name='email' className='input-form' type='email'></input>
                </div>
                <div className='div-form'>
                    <label htmlFor="password" className='label-form'>Password</label>
                    <input id='password' name='password' className='input-form' type='password'></input>
                </div>
                <div className='flex flex-col justify-center items-center mt-5 md:mt-10 gap-3 md:gap-5'>
                    <button className='btn-primary' type='submit'>
                        SIGN IN
                    </button>
                    <p className='text-xl'>No account ? <Link href="/signup" className='underline hover:decoration-main decoration-3'>SIGN UP</Link></p>
                </div>

            </form>            
        </div>
    )
}
