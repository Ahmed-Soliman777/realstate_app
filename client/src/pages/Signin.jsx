import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { signInStart, signInSuccess, signInFailure } from '../redux/user/user.slice'
import OAuth from '../components/OAuth'

const Signin = () => {
  const [formData, setFormData] = useState({}) // to get username - email - password
  const { error, loading } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value })
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      // setLoading(true)
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json()
      // console.log(data);
      if (data.success === false) {
        // setError(data.message)
        // setLoading(false)
        dispatch(signInFailure())
        return
      }

      // setLoading(false)
      // setError(null
      dispatch(signInSuccess(data))
      navigate("/")

    } catch (error) {
      // setLoading(false)
      // setError(error.message)
      dispatch(signInFailure(error.message))
    }
  }
  console.log(formData);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign in'}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5 ">
        <p className="">New to <span className="text-slate-500 font-bold">Modo</span><span className="text-slate-700 font-bold">Estate</span>?</p>
        <Link className='text-blue-700' to="/sign-up">
          Create new account
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  )
}

export default Signin
