import {
	ClockIcon,
	FilmIcon,
	HomeModernIcon,
	MagnifyingGlassIcon,
	TicketIcon,
	UsersIcon,
	VideoCameraIcon
} from '@heroicons/react/24/outline'
import { Bars3Icon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
	const { auth, setAuth } = useContext(AuthContext)
	const [menuOpen, setMenuOpen] = useState(false)
	const [isLoggingOut, SetLoggingOut] = useState(false)

	const toggleMenu = () => {
		setMenuOpen(!menuOpen)
	}

	const navigate = useNavigate()

	const onLogout = async () => {
		try {
			SetLoggingOut(true)
			await axios.get('/auth/logout')
			setAuth({ username: null, email: null, role: null, token: null })
			sessionStorage.clear()
			navigate('/')
			toast.success('Logout successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetLoggingOut(false)
		}
	}

	const menuLists = () => {
		return (
			<>
				<div className="flex flex-col gap-2 lg:flex-row font-medium text-sm">
					<Link
						to={'/cinema'}
						className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-black hover:bg-gray-300 ${
							window.location.pathname === '/cinema'
								? 'bg-gradient-to-br from-blue-300 to-blue-200'
								: 'bg-gray-200'
						}`}
					>
						<HomeModernIcon className="h-5 w-5" />
						<p>Cinema</p>
					</Link>
					<Link
						to={'/schedule'}
						className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-black hover:bg-gray-300 ${
							window.location.pathname === '/schedule'
								? 'bg-gradient-to-br from-blue-300 to-blue-200'
								: 'bg-gray-200'
						}`}
					>
						<ClockIcon className="h-5 w-5" />
						<p>Schedule</p>
					</Link>
					{auth.role && (
						<Link
							to={'/ticket'}
							className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-black hover:bg-gray-300 ${
								window.location.pathname === '/ticket'
									? 'bg-gradient-to-br from-blue-300 to-blue-200'
									: 'bg-gray-200'
							}`}
						>
							<TicketIcon className="h-5 w-5" />
							<p>Ticket</p>
						</Link>
					)}
					{auth.role === 'admin' && (
						<>
							<Link
								to={'/movie'}
								className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-black hover:bg-gray-300 ${
									window.location.pathname === '/movie'
										? 'bg-gradient-to-br from-blue-300 to-blue-200'
										: 'bg-gray-200'
								}`}
							>
								<VideoCameraIcon className="h-5 w-5" />
								<p>Movie</p>
							</Link>
							<Link
								to={'/search'}
								className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-black hover:bg-gray-300 ${
									window.location.pathname === '/search'
										? 'bg-gradient-to-br from-blue-300 to-blue-200'
										: 'bg-gray-200'
								}`}
							>
								<MagnifyingGlassIcon className="h-5 w-5" />
								<p>Search</p>
							</Link>
							<Link
								to={'/user'}
								className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-black hover:bg-gray-300 ${
									window.location.pathname === '/user'
										? 'bg-gradient-to-br from-blue-300 to-blue-200'
										: 'bg-gray-200'
								}`}
							>
								<UsersIcon className="h-5 w-5" />
								<p>User</p>
							</Link>
						</>
					)}
				</div>
				<div className="flex grow items-center justify-center gap-3 lg:justify-end">
					{auth.username && (
						<p className="text-md whitespace-nowrap leading-none text-black font-semibold">Welcome {auth.username}!</p>
					)}
					{auth.token ? (
						<button
							className="rounded-full bg-gradient-to-br from-blue-500 to-blue-400 px-4 py-2 text-white drop-shadow-md hover:from-blue-400 hover:to-blue-300 disabled:from-gray-400 disabled:to-gray-300 text-sm font-semibold"
							onClick={() => onLogout()}
							disabled={isLoggingOut}
						>
							{isLoggingOut ? 'Processing...' : 'Logout'}
						</button>
					) : (
						<button className="rounded-full bg-gradient-to-br from-blue-500 to-blue-400 px-4 py-2 text-white drop-shadow-md hover:from-blue-400 hover:to-blue-300 text-sm font-semibold">
							<Link to={'/login'}>Login</Link>
						</button>
					)}
				</div>
			</>
		)
	}

	return (
		<nav className="flex flex-col items-center justify-between gap-2 bg-gray-100 px-4 py-3 drop-shadow-md lg:flex-row lg:justify-start sm:px-8">
			<div className="flex w-full flex-row justify-between lg:w-fit">
				<button className="flex flex-row items-center gap-2" onClick={() => navigate('/')}>
					<FilmIcon className="h-8 w-8 text-blue-600" />
					<h1 className="mr-2 text-2xl font-bold text-blue-700 tracking-wide">Cinema</h1>
				</button>
				<button
					className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-300 lg:hidden"
					onClick={() => toggleMenu()}
				>
					<Bars3Icon className="h-6 w-6 text-black" />
				</button>
			</div>
			<div className="hidden grow justify-between gap-2 lg:flex">{menuLists()}</div>
			{menuOpen && <div className="flex w-full grow flex-col gap-2 lg:hidden">{menuLists()}</div>}
		</nav>
	)
}

export default Navbar
