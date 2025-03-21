import {
	ChevronDoubleDownIcon,
	ChevronDoubleUpIcon,
	MagnifyingGlassIcon,
	TicketIcon,
	TrashIcon
} from '@heroicons/react/24/outline'
import axios from 'axios'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import { AuthContext } from '../context/AuthContext'
import BASE_URL from '../config'
const User = () => {
	const { auth } = useContext(AuthContext)
	const [users, setUsers] = useState(null)
	const [ticketsUser, setTicketsUser] = useState(null)
	const [tickets, setTickets] = useState([])
	const [isUpdating, SetIsUpdating] = useState(false)
	const [isDeleting, SetIsDeleting] = useState(false)

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors }
	} = useForm()

	const fetchUsers = async () => {
		try {
			const response = await axios.get(`${BASE_URL}/auth/user`, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			setUsers(response.data.data)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		fetchUsers()
	}, [])

	const onUpdateUser = async (data) => {
		try {
			SetIsUpdating(true)
			const response = await axios.put(`${BASE_URL}/auth/user/${data.id}`, data, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			fetchUsers()
			toast.success(`Update ${response.data.data.username} to ${response.data.data.role} successful!`, {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			oast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetIsUpdating(false)
		}
	}

	const handleDelete = (data) => {
		const confirmed = window.confirm(`Do you want to delete user ${data.username}?`)
		if (confirmed) {
			onDeleteUser(data)
		}
	}

	const onDeleteUser = async (data) => {
		try {
			SetIsDeleting(true)
			await axios.delete(`${BASE_URL}/auth/user/${data.id}`, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			fetchUsers()
			toast.success('Delete successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			oast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetIsDeleting(false)
		}
	}

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-pink-200 via-yellow-100 to-green-200 pb-8 text-gray-800 sm:gap-8">
			<Navbar />
			<div className="mx-4 flex h-fit flex-col gap-4 rounded-xl bg-white p-6 shadow-2xl sm:mx-8">
				<h2 className="text-4xl font-extrabold text-indigo-700">Manage Users</h2>
				<div className="relative">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
					</div>
					<input
						type="search"
						className="block w-full rounded-xl border border-gray-300 p-3 pl-12 text-lg text-gray-800 shadow"
						placeholder="Search by username"
						{...register('search')}
					/>
				</div>
				<div className="mt-4 overflow-x-auto rounded-lg border border-gray-300 bg-gray-50 shadow">
					<table className="w-full text-center">
						<thead className="bg-gradient-to-r from-indigo-700 to-purple-600 text-white">
							<tr>
								<th className="p-3">Username</th>
								<th className="p-3">Email</th>
								<th className="p-3">Role</th>
								<th className="p-3">Tickets</th>
								<th className="p-3">Actions</th>
							</tr>
						</thead>
						<tbody>
							{users?.filter(user => user.username.toLowerCase().includes(watch('search')?.toLowerCase() || '')).map((user, index) => (
								<tr key={index} className="border-b bg-white hover:bg-gray-100">
									<td className="p-3 font-semibold">{user.username}</td>
									<td className="p-3">{user.email}</td>
									<td className="p-3 capitalize">{user.role}</td>
									<td className="p-3">
										<button
											className={`rounded-full bg-gradient-to-r py-1 px-4 text-white text-sm shadow ${ticketsUser === user.username ? 'from-green-600 to-green-400' : 'from-gray-600 to-gray-400'}`}
											onClick={() => { setTickets(user.tickets); setTicketsUser(user.username); }}
										>
											{user.tickets.length} Tickets
										</button>
									</td>
									<td className="flex justify-center gap-2 p-3">
										{user.role === 'user' && (
											<button
												className="rounded bg-indigo-500 px-3 py-1 text-white hover:bg-indigo-400"
												onClick={() => onUpdateUser({ id: user._id, role: 'admin' })}
												disabled={isUpdating}
											>
												Admin <ChevronDoubleUpIcon className="inline h-4 w-4" />
											</button>
										)}
										{user.role === 'admin' && (
											<button
												className="rounded bg-purple-500 px-3 py-1 text-white hover:bg-purple-400"
												onClick={() => onUpdateUser({ id: user._id, role: 'user' })}
												disabled={isUpdating}
											>
												User <ChevronDoubleDownIcon className="inline h-4 w-4" />
											</button>
										)}
										<button
											className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-500"
											onClick={() => handleDelete({ id: user._id, username: user.username })}
											disabled={isDeleting}
										>
											<TrashIcon className="inline h-4 w-4" /> Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{ticketsUser && (
					<div className="mt-6">
						<h3 className="mb-4 text-2xl font-bold text-indigo-600">{ticketsUser}'s Tickets</h3>
						{tickets.length === 0 ? <p className="text-center">No tickets purchased</p> : (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{tickets.map((ticket, index) => (
									<div key={index} className="rounded-xl bg-white p-4 shadow-xl">
										<ShowtimeDetails showtime={ticket.showtime} />
										<div className="mt-2 border-t pt-2 text-center">
											<p className="font-semibold">Seats: {ticket.seats.map(seat => seat.row + seat.number).join(', ')}</p>
											<p className="text-sm text-gray-500">Total: {ticket.seats.length} seats</p>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default User