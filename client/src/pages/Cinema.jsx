import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import CinemaLists from '../components/CinemaLists'
import Navbar from '../components/Navbar'
import TheaterListsByCinema from '../components/TheaterListsByCinema'
import { AuthContext } from '../context/AuthContext'
import BASE_URL from '../config'
const Cinema = () => {
	const { auth } = useContext(AuthContext)
	const [selectedCinemaIndex, setSelectedCinemaIndex] = useState(
		parseInt(sessionStorage.getItem('selectedCinemaIndex')) || 0
	)
	const [cinemas, setCinemas] = useState([])
	const [isFetchingCinemas, setIsFetchingCinemas] = useState(true)

	const fetchCinemas = async (newSelectedCinema) => {
		try {
			setIsFetchingCinemas(true)
			let response
			if (auth.role === 'admin') {
				response = await axios.get(`${BASE_URL}/cinema/unreleased`, {
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				})
			} else {
				response = await axios.get(`${BASE_URL}/cinema`)
			}

			setCinemas(response.data.data)
			if (newSelectedCinema) {
				response.data.data.map((cinema, index) => {
					if (cinema.name === newSelectedCinema) {
						setSelectedCinemaIndex(index)
						sessionStorage.setItem('selectedCinemaIndex', index)
					}
				})
			}
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingCinemas(false)
		}
	}

	useEffect(() => {
		fetchCinemas()
	}, [])

	const props = {
		cinemas,
		selectedCinemaIndex,
		setSelectedCinemaIndex,
		fetchCinemas,
		auth,
		isFetchingCinemas
	}
	return (
		<div className="flex min-h-screen flex-col gap-10 bg-gradient-to-br from-white via-gray-100 to-gray-200 text-gray-800 pb-10 sm:gap-14 font-sans">
			<Navbar />
			<div className="container mx-auto px-6">
				<CinemaLists {...props} />
				{cinemas[selectedCinemaIndex]?.name && (
					<div className="mt-10 shadow-lg rounded-xl p-6 bg-white">
						<TheaterListsByCinema {...props} />
					</div>
				)}
			</div>
		</div>
	)
}
export default Cinema
