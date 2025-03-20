import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import CinemaLists from '../components/CinemaLists'
import Navbar from '../components/Navbar'
import TheaterListsByCinema from '../components/TheaterListsByCinema'
import { AuthContext } from '../context/AuthContext'

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
				response = await axios.get('/cinema/unreleased', {
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				})
			} else {
				response = await axios.get('/cinema')
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
		<div className="flex min-h-screen flex-col gap-6 bg-gradient-to-br from-gray-100 to-gray-300 pb-8 sm:gap-10">
			<Navbar />
			<div className="container mx-auto px-4">
				<CinemaLists {...props} />
				{cinemas[selectedCinemaIndex]?.name && (
					<div className="mt-8">
						<TheaterListsByCinema {...props} />
					</div>
				)}
			</div>
		</div>
	)
}

export default Cinema
