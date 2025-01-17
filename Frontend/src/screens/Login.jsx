import React, { useContext, useState } from 'react'
import axios from '../config/axios.js'
import { useNavigate } from 'react-router-dom'
import { userContext } from '../context/User.context.jsx'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const {setUser} = useContext(userContext)

    const submitHandler= async (e)=>{
        e.preventDefault();

        axios.post('/users/login',{
            email,
            password
        }).then((res)=>{

            console.log(res.data)

            localStorage.setItem('token',res.data.token)
            setUser(res.data.user)
            navigate('/')

        }).catch((err)=>{console.log(err.response.data)})


        

    console.log( email , password)
    setEmail('')
    setPassword('')
    }


  return (
    <div>
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
<h2 className="text-2xl font-bold text-center mb-6">Student Login</h2>

<form onSubmit={(e)=>{
    submitHandler(e)
}} id="login-form" className="space-y-4">

    <div>
    <label className="block mb-1 text-gray-700" >Email Address</label>
    <input
    value = {email}
    onChange={(e)=>{
    setEmail(e.target.value)
    }}
        type="email"
        id="email" 
        name="email"
        className="w-full border border-gray-300 rounded px-3 py-2"
        required
    />
    </div>
    <div>
    <label className="block mb-1 text-gray-700" >Password</label>
    <input
    value={password}
    onChange={(e)=>{
        setPassword(e.target.value)
    }}
        type="tel"
        id="phone"
        name="phone"
        className="w-full border border-gray-300 rounded px-3 py-2"
        required
    />
    </div>

    <button
    type="submit"
    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
    Login
    </button>
</form>
<div id="form-result" className="mt-4 text-green-600 hidden">
    Login successFull!..
</div>
</div>

</div>
  )
}
export default Login



