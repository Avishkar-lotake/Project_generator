import React, { useState,useEffect,useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { userContext } from '../context/User.context'

const UserAuth = ({children}) => {
    const navigate = useNavigate()
    const {user} = useContext(userContext)
    const [loading, setLoading] = useState(true)
    const token = localStorage.getItem('token')

    useEffect(() => {
    if(user){
        setLoading(false)
    }
    if(!token){
        navigate('/login')
    }
    if(!user){
        navigate('/login')
    }

    }, [])

    if(loading){
        return <div> ....Loading </div>
    }
    
  return (
    <>{children}</>
  )
}

export default UserAuth