import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import MovieLists from '../components/MovieLists'
import Navbar from '../components/Navbar'
import { AuthContext } from '../context/AuthContext'

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

	const fetchMovies = async (data) => {
		try {
			setIsFetchingMoviesDone(false)
			const response = await axios.get('/movie')
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
			const response = await axios.post('/movie', data, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			fetchMovies()
			toast.success('Add movie successful!', {
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
			SetIsAddingMovie(false)
		}
	}

	const handleDelete = (movie) => {
		const confirmed = window.confirm(
			`Do you want to delete movie ${movie.name}, including its showtimes and tickets?`
		)
		if (confirmed) {
			onDeleteMovie(movie._id)
		}
	}

	const onDeleteMovie = async (id) => {
		try {
			const response = await axios.delete(`/movie/${id}`, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			fetchMovies()
			toast.success('Delete movie successful!', {
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
		}
	}

	const inputHr = parseInt(watch('lengthHr')) || 0
	const inputMin = parseInt(watch('lengthMin')) || 0
	const sumMin = inputHr * 60 + inputMin
	const hr = Math.floor(sumMin / 60)
	const min = sumMin % 60

	return (
		<div className="flex min-h-screen flex-col gap-6 bg-gradient-to-b from-white to-gray-200 pb-10 text-gray-900">
			<Navbar />
			<div className="mx-auto w-full max-w-6xl p-6 bg-white shadow-xl rounded-2xl space-y-6">
				<h2 className="text-4xl font-bold text-center text-gray-800">Movie Management</h2>
				<form
					onSubmit={handleSubmit(onAddMovie)}
					className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
				>
					<div className="space-y-4">
						<h3 className="text-xl font-semibold text-gray-700">Add New Movie</h3>
						<input
							type="text"
							placeholder="Movie Name"
							required
							className="w-full rounded-lg border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
							{...register('name', { required: true })}
						/>
						<input
							type="text"
							placeholder="Poster URL"
							required
							className="w-full rounded-lg border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
							{...register('img', { required: true })}
						/>
						<input
							type="number"
							min="0"
							max="20"
							placeholder="Length (Hours)"
							className="w-full rounded-lg border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
							{...register('lengthHr')}
						/>
						<input
							type="number"
							min="0"
							max="2000"
							placeholder="Length (Minutes)"
							required
							className="w-full rounded-lg border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
							{...register('lengthMin', { required: true })}
						/>
						<p className="text-gray-500">{`${hr}h ${min}m / ${sumMin} minutes`}</p>
					</div>
					{watch('img') && (
						<div className="flex items-center justify-center">
							<img src={watch('img')} className="h-64 rounded-xl shadow-md object-contain" />
						</div>
					)}
					<div className="flex items-end justify-center">
						<button
							type="submit"
							disabled={isAddingMovie}
							className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white text-lg font-medium shadow-md hover:bg-blue-700 disabled:opacity-50"
						>
							{isAddingMovie ? 'Adding...' : 'Add Movie'}
						</button>
					</div>
				</form>
				<div className="relative mt-8">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
					</div>
					<input
						type="search"
						placeholder="Search movie..."
						className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
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
	)
}

export default Movie
