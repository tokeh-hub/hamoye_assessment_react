import React,{useState} from 'react'

const SignIn = () => {
    const [email,setEmail] = useState('')
    const [emailError,setEmailError] = useState('')
    const [passwordError,setPasswordError] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    var data = JSON.parse(localStorage.getItem('data'))
    
    const signIn = (e) => {
        setEmailError('')
        setPasswordError('')
        e.preventDefault()
        var userDetails = {
            "email": email,
             "password":password
        }
      var emailFound = data?.find(element=>element.email === email)
      if(emailFound){setPasswordError('');setEmailError('User is registered. Please Login')}
      if(password !== confirmPassword){setEmailError('');setPasswordError('Your passwords are not the same')}
      if(password === confirmPassword && !emailFound){
        data.push(userDetails)
        localStorage.setItem('data',JSON.stringify(data))
      }
    }
  return (
    <div className='flex justify-center items-center bg-gradient-to-b from-fuchsia-500 to-indigo-600 h-screen'>
    <div className='w-screen mx-6 sm:mx-0 sm:w-[400px] h-96 rounded-md bg-white p-8 mt-12'>
        <h2 className='text-xl text-slate-500 font-bold pb-8'>Sign In</h2>
        
        <form onSubmit={signIn} className='flex flex-col'>
            <div className='mb-8'>
            {emailError && <p className='text-red-500 text-start font-medium pb-1'>{emailError}</p>}
            <input type='email' className='w-full text-white py-1 px-2 rounded-md outline-none bg-slate-500' placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} required/>
            </div>
            <div className='mb-8'>
            {passwordError && <p className='text-red-500 font-medium -mt-4 text-start pb-1'>{passwordError}</p>}
            <input type='password' className='w-full text-white py-1 px-2 rounded-md outline-none bg-slate-500' placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)} required/>
            </div>
            <input type='password' className='w-full text-white mb-8 py-1 px-2 rounded-md outline-none bg-slate-500' placeholder='Please confirm passsword' value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required/>
            <input type='submit' className='cursor-pointer mb-8 w-full py-1 px-2 rounded-md text-white bg-fuchsia-500 hover:bg-fuchsia-600 font-medium text-lg' value='Sign In'/>
        </form>
    </div>
    
    </div>
  )
}

export default SignIn