import React,{useState} from 'react'
import { NavLink,useNavigate } from 'react-router-dom'

const Login = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState('')
    const data = JSON.parse(localStorage.getItem('data'))
    // const data = [{"email":"olalekemoshood@yahoo.com","password":"1234"}]
    // console.log(data)
    const history = useNavigate()

    const login = (e) => {
        e.preventDefault()
        var userEmailFound = data?.find(element=>element.email === email)
        if(userEmailFound && userEmailFound.password !== password){
            setError('Password is incorrect')
        }
        if(userEmailFound && userEmailFound.password === password){
            setError('')
            history('/dashboard')
        }
        if(!userEmailFound){
            setError('This Email is not registered. Please sign in')
        }
    }

  return (
    <div className='flex justify-center items-center bg-gradient-to-b from-fuchsia-500 to-indigo-600 h-screen'>
    <div className='w-screen mx-6 sm:mx-0 sm:w-[400px] h-80 rounded-md bg-white p-8 mt-12'>
        <h2 className='text-xl text-slate-500 font-bold pb-8'>Login</h2>
        <p className='text-red-500'>{error}</p>
        <form onSubmit={login} className='flex flex-col gap-8'>
            <input type='email' className='w-full text-white py-1 px-2 rounded-md outline-none bg-slate-500' placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} required/>
            <input type='password' className='w-full text-white py-1 px-2 rounded-md outline-none bg-slate-500' placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)} required/>
            <input type='submit' className='cursor-pointer hover:bg-fuchsia-600 w-full py-1 px-2 rounded-md text-white bg-fuchsia-500 font-medium text-lg' value='Log in'/>
        </form>
        <p className={`text-slate-500 text-start pt-3 ${error !== '' && 'pt-8'}`}>New Here? <NavLink to='/signin' className='text-fuchsia-500 hover:text-fuchsia-600 underline'>Sign In</NavLink></p>
    </div>
    
    </div>
  )
}

export default Login