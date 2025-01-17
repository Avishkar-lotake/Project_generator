import React from 'react'
import { useState ,useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from '../config/axios'
import {userContext} from '../context/User.context'

const Register = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {setUser} =  useContext(userContext)
    const navigate = useNavigate()

    // const {user ,setUser} = React.useContext(AuthContext)


    const submitHandler= async (e)=>{
    e.preventDefault();

    // const newUser = {
    // userName:userName,
    // email:email,
    // password:password
    // }

    // const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`,newUser)
    axios.post('/users/register',{
        email,
        password
    }).then((res)=>{
        console.log(res.data)
        localStorage.setItem('token', res.data.token)
        setUser(res.data.user)

        navigate('/')
    }).catch((err) =>
        {console.log(err.response.data)}
        )
    // if (response.status === 201){
    //     const data = response.data
    //     setUser(data.user)
    //     localStorage.setItem('token',data.token)
    //     navigate('/home')
    // }
    // console.log(userName , email , password)
    setEmail('')
    setPassword('')

    }



    return (
    <div>
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
    <h2 className="text-2xl font-bold text-center mb-6">Student Registration</h2>

    <form onSubmit={(e)=>{
        submitHandler(e)
    }} id="registration-form" className="space-y-4">


    
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
        Register
        </button>
    </form>
    <div id="form-result" className="mt-4 text-green-600 hidden">
        Registration successful!
    </div>
    </div>

</div>
    )
}

export default Register