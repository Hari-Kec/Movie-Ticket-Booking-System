import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import MovieLists from '../components/MovieLists'
import Navbar from '../components/Navbar'
import { AuthContext } from '../context/AuthContext'
import BASE_URL from '../config'
const Movie = () => {
	const { auth } = useContext(AuthContext)
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors }
	} = useForm()

	const [movies, setMovies] = useState([])
	const [isFetchingMoviesDone, setIsFetchingMoviesDone] = useState(false)
	const [isAddingMovie, SetIsAddingMovie] = useState(false)

	const fetchMovies = async () => {
		try {
			setIsFetchingMoviesDone(false)
			const response = await axios.get('${BASE_URL}/movie')
			reset()
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

	const onAddMovie = async (data) => {
		try {
			data.length = (parseInt(data.lengthHr) || 0) * 60 + (parseInt(data.lengthMin) || 0)
			SetIsAddingMovie(true)
			await axios.post('${BASE_URL}/movie', data, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			fetchMovies()
			toast.success('Movie added!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error('Error adding movie', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetIsAddingMovie(false)
		}
	}

	const handleDelete = (movie) => {
		const confirmed = window.confirm(
			`Delete movie ${movie.name} with all showtimes and tickets?`
		)
		if (confirmed) {
			onDeleteMovie(movie._id)
		}
	}

	const onDeleteMovie = async (id) => {
		try {
			await axios.delete(`${BASE_URL}/movie/${id}`, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			fetchMovies()
			toast.success('Movie deleted!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error('Error deleting movie', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		}
	}

	const inputHr = parseInt(watch('lengthHr')) || 0
	const inputMin = parseInt(watch('lengthMin')) || 0
	const sumMin = inputHr * 60 + inputMin
	const hr = Math.floor(sumMin / 60)
	const min = sumMin % 60

	return (
		<div className="min-h-screen bg-gradient-to-tr from-white via-pink-50 to-purple-50 text-gray-800 flex flex-col">
			<Navbar />
			<div className="max-w-7xl mx-auto w-full px-8 py-12">
				<h2 className="text-5xl font-extrabold mb-10 text-center">Manage Movies</h2>
				<div className="grid md:grid-cols-2 gap-12">
					<form onSubmit={handleSubmit(onAddMovie)} className="bg-white p-8 shadow-2xl rounded-3xl space-y-6 border border-gray-200">
						<h3 className="text-2xl font-semibold text-center">Add New Movie</h3>
						<input
							type="text"
							placeholder="Movie Name"
							required
							className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400"
							{...register('name', { required: true })}
						/>
						<input
							type="text"
							placeholder="Poster URL"
							required
							className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400"
							{...register('img', { required: true })}
						/>
						<div className="flex gap-4">
							<input
								type="number"
								min="0"
								max="20"
								placeholder="Hours"
								className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400"
								{...register('lengthHr')}
							/>
							<input
								type="number"
								min="0"
								max="2000"
								placeholder="Minutes"
								required
								className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400"
								{...register('lengthMin', { required: true })}
							/>
						</div>
						<p className="text-center text-gray-500">{`${hr}h ${min}m | ${sumMin} mins`}</p>
						{watch('img') && (
							<div className="flex justify-center">
								<img src={watch('img')} className="h-56 rounded-xl object-contain shadow-xl" />
							</div>
						)}
						<button
							type="submit"
							disabled={isAddingMovie}
							className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold rounded-2xl transition"
						>
							{isAddingMovie ? 'Adding...' : 'Add Movie'}
						</button>
					</form>
					<div>
						<div className="relative mb-6">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
							</div>
							<input
								type="search"
								placeholder="Search movies"
								className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-purple-400"
								{...register('search')}
							/>
						</div>
						{isFetchingMoviesDone ? (
							<MovieLists movies={movies} search={watch('search')} handleDelete={handleDelete} />
						) : (
							<Loading />
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Movie
