import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthContext } from '../context/AuthContext'
import { FaUser, FaLock } from 'react-icons/fa'
import BASE_URL from '../config'

const Login = () => {
	const navigate = useNavigate()
	const { auth, setAuth } = useContext(AuthContext)
	const [errorsMessage, setErrorsMessage] = useState('')
	const [isLoggingIn, SetLoggingIn] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm()

	const onSubmit = async (data) => {
		SetLoggingIn(true)
		try {
			const response = await axios.post(`${BASE_URL}/auth/login`, data)
			toast.success('Login successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
			setAuth((prev) => ({ ...prev, token: response.data.token }))
			navigate('/')
		} catch (error) {
			setErrorsMessage(error.response.data)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetLoggingIn(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100">
			<div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
				<div>
					<h2 className="mt-4 text-center text-3xl font-bold text-gray-800">Login</h2>
				</div>
				<form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
					<div className="relative">
						<FaUser className="absolute left-3 top-3 text-gray-400" />
						<input
							name="username"
							type="text"
							{...register('username', { required: true })}
							className={`w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-400 ${
								errors.username ? 'border-red-500' : 'border-gray-300'
							}`}
							placeholder="Username"
						/>
						{errors.username && <span className="text-xs text-red-500">Username is required</span>}
					</div>
					<div className="relative">
						<FaLock className="absolute left-3 top-3 text-gray-400" />
						<input
							name="password"
							type="password"
							{...register('password', { required: true })}
							className={`w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-400 ${
								errors.password ? 'border-red-500' : 'border-gray-300'
							}`}
							placeholder="Password"
						/>
						{errors.password && <span className="text-xs text-red-500">Password is required</span>}
					</div>

					{errorsMessage && <span className="text-sm text-red-500">{errorsMessage}</span>}

					<button
						type="submit"
						className="w-full mt-4 rounded-md bg-blue-500 py-2 px-4 text-white hover:bg-blue-600"
						disabled={isLoggingIn}
					>
						{isLoggingIn ? 'Processing...' : 'Login'}
					</button>

					<p className="text-center text-sm text-gray-600 mt-4">
						Don’t have an account?{' '}
						<Link to={'/register'} className="font-semibold text-blue-500 hover:underline">
							Register here
						</Link>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Login
