import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '../components/Navbar'
import NowShowing from '../components/NowShowing'
import TheaterListsByMovie from '../components/TheaterListsByMovie'
import { AuthContext } from '../context/AuthContext'
import Chatbot from './Chatbot'

const Home = () => {
	const { auth } = useContext(AuthContext)
	const [selectedMovieIndex, setSelectedMovieIndex] = useState(parseInt(sessionStorage.getItem('selectedMovieIndex')))
	const [movies, setMovies] = useState([])
	const [isFetchingMoviesDone, setIsFetchingMoviesDone] = useState(false)

	const fetchMovies = async () => {
		try {
			setIsFetchingMoviesDone(false)
			let response
			if (auth.role === 'admin') {
				response = await axios.get('/movie/unreleased/showing', {
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				})
			} else {
				response = await axios.get('/movie/showing')
			}
			setMovies(response.data.data)
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingMoviesDone(true)
		}
	}

	useEffect(() => {
		fetchMovies()
	}, [])

	const props = {
		movies,
		selectedMovieIndex,
		setSelectedMovieIndex,
		auth,
		isFetchingMoviesDone
	}

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-r from-white via-blue-50 to-blue-100 text-gray-900 font-sans">
			<Navbar />
			<div className="container mx-auto px-6 py-10">
				<h1 className="text-4xl font-bold mb-8 text-center">Now Showing</h1>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
					<NowShowing {...props} />
				</div>
				{movies[selectedMovieIndex]?.name && (
					<div className="mt-12 bg-white shadow-md rounded-2xl p-8 border border-gray-200">
						<h2 className="text-2xl font-semibold mb-6 text-center">Available Theaters</h2>
						<TheaterListsByMovie {...props} />
					</div>
				)}
			</div>
			<div className="fixed bottom-6 right-6">
				<Chatbot />
			</div>
		</div>
	)
}

export default Home
