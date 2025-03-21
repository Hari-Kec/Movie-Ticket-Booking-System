import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import { AuthContext } from '../context/AuthContext'

const Tickets = () => {
	const { auth } = useContext(AuthContext)
	const [tickets, setTickets] = useState([])
	const [isFetchingticketsDone, setIsFetchingticketsDone] = useState(false)
	const fetchTickets = async () => {
		try {
			setIsFetchingticketsDone(false)
			const response = await axios.get('/auth/tickets', {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			setTickets(
				response.data.data.tickets?.sort((a, b) => {
					if (a.showtime.showtime > b.showtime.showtime) {
						return 1
					}
					return -1
				})
			)
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingticketsDone(true)
		}
	}

	useEffect(() => {
		fetchTickets()
	}, [])

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-gradient-to-tr from-gray-900 via-purple-800 to-pink-700 pb-8 text-white font-mono sm:gap-8">
			<Navbar />
			<div className="mx-4 flex h-fit flex-col gap-6 rounded-xl bg-gradient-to-tr from-gray-700 to-purple-600 p-6 shadow-2xl sm:mx-10 sm:p-8">
				<h2 className="text-4xl font-extrabold tracking-wider text-yellow-300 text-center">My Booked Tickets</h2>
				{isFetchingticketsDone ? (
					<>
						{tickets.length === 0 ? (
							<p className="text-center text-xl text-gray-200">No tickets purchased yet.</p>
						) : (
							<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
								{tickets.map((ticket, index) => (
									<div className="rounded-2xl border border-yellow-400 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4 shadow-2xl" key={index}>
										<ShowtimeDetails showtime={ticket.showtime} />
										<div className="mt-4 flex flex-col items-center rounded-xl bg-yellow-100 px-4 py-3 text-gray-800">
											<p className="font-bold">Seats:</p>
											<p className="text-center font-semibold text-lg">
												{ticket.seats.map((seat) => seat.row + seat.number).join(', ')}
											</p>
											<p className="text-sm text-gray-600">Total: {ticket.seats.length} seat(s)</p>
										</div>
									</div>
								))}
							</div>
						)}
					</>
				) : (
					<Loading />
				)}
			</div>
		</div>
	)
}

export default Tickets
