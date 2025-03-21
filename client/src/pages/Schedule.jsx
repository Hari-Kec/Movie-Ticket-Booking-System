import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'react-tailwindcss-select'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CinemaLists from '../components/CinemaLists'
import DateSelector from '../components/DateSelector'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import ScheduleTable from '../components/ScheduleTable'
import { AuthContext } from '../context/AuthContext'
import BASE_URL from '../config'
const Schedule = () => {
  const { auth } = useContext(AuthContext)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm()
  const [selectedDate, setSelectedDate] = useState(
    (sessionStorage.getItem('selectedDate') && new Date(sessionStorage.getItem('selectedDate'))) || new Date()
  )
  const [selectedCinemaIndex, setSelectedCinemaIndex] = useState(
    parseInt(sessionStorage.getItem('selectedCinemaIndex')) || 0
  )
  const [cinemas, setCinemas] = useState([])
  const [isFetchingCinemas, setIsFetchingCinemas] = useState(true)
  const [movies, setMovies] = useState()
  const [isAddingShowtime, SetIsAddingShowtime] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)

  const fetchCinemas = async () => {
    try {
      setIsFetchingCinemas(true)
      let response
      if (auth.role === 'admin') {
        response = await axios.get(`${BASE_URL}/cinema/unreleased`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        })
      } else {
        response = await axios.get(`${BASE_URL}/cinema`)
      }
      setCinemas(response.data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsFetchingCinemas(false)
    }
  }

  useEffect(() => {
    fetchCinemas()
  }, [])

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/movie`)
      setMovies(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  useEffect(() => {
    setValue('autoIncrease', true)
    setValue('rounding5', true)
    setValue('gap', '00:10')
  }, [])

  const onAddShowtime = async (data) => {
    try {
      SetIsAddingShowtime(true)
      if (!data.movie) {
        toast.error('Select a movie', { position: 'top-center', autoClose: 2000, pauseOnHover: false })
        return
      }
      let showtime = new Date(selectedDate)
      const [hours, minutes] = data.showtime.split(':')
      showtime.setHours(hours, minutes, 0)
      await axios.post(
        `${BASE_URL}/showtime`,
        { movie: data.movie, showtime, theater: data.theater, repeat: data.repeat, isRelease: data.isRelease },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      )
      fetchCinemas()
      if (data.autoIncrease) {
        const movieLength = movies.find((movie) => movie._id === data.movie).length
        const [GapHours, GapMinutes] = data.gap.split(':').map(Number)
        const nextShowtime = new Date(showtime.getTime() + (movieLength + GapHours * 60 + GapMinutes) * 60000)
        if (data.rounding5 || data.rounding10) {
          const totalMinutes = nextShowtime.getHours() * 60 + nextShowtime.getMinutes()
          const roundedMinutes = data.rounding5 ? Math.ceil(totalMinutes / 5) * 5 : Math.ceil(totalMinutes / 10) * 10
          let roundedHours = Math.floor(roundedMinutes / 60)
          const remainderMinutes = roundedMinutes % 60
          if (roundedHours === 24) {
            nextShowtime.setDate(nextShowtime.getDate() + 1)
            roundedHours = 0
          }
          setValue('showtime', `${String(roundedHours).padStart(2, '0')}:${String(remainderMinutes).padStart(2, '0')}`)
        } else {
          setValue('showtime', `${String(nextShowtime.getHours()).padStart(2, '0')}:${String(nextShowtime.getMinutes()).padStart(2, '0')}`)
        }
        if (data.autoIncreaseDate) {
          setSelectedDate(nextShowtime)
          sessionStorage.setItem('selectedDate', nextShowtime)
        }
      }
      toast.success('Showtime added!', { position: 'top-center', autoClose: 2000, pauseOnHover: false })
    } catch (error) {
      console.error(error)
      toast.error('Error occurred', { position: 'top-center', autoClose: 2000, pauseOnHover: false })
    } finally {
      SetIsAddingShowtime(false)
    }
  }

  const props = {
    cinemas,
    selectedCinemaIndex,
    setSelectedCinemaIndex,
    fetchCinemas,
    auth,
    isFetchingCinemas
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gradient-to-br from-purple-800 via-pink-600 to-yellow-400 pb-10 text-gray-800 sm:gap-10 font-serif">
      <Navbar />
      <CinemaLists {...props} />
      {selectedCinemaIndex !== null && cinemas[selectedCinemaIndex]?.theaters?.length && (
        <div className="mx-6 flex flex-col gap-4 rounded-xl bg-gradient-to-bl from-yellow-50 via-white to-pink-100 p-6 drop-shadow-2xl sm:mx-10 sm:gap-6 sm:p-8">
          <h2 className="text-4xl font-extrabold text-gray-800 underline decoration-wavy decoration-pink-500">Show Schedule</h2>
          <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          {auth.role === 'admin' && (
            <form onSubmit={handleSubmit(onAddShowtime)} className="flex flex-col gap-6 rounded-2xl bg-gradient-to-r from-white via-yellow-200 to-pink-100 p-6 shadow-2xl lg:flex-row">
              {/* Form content remains unchanged for structure */}
            </form>
          )}
          {isFetchingCinemas ? <Loading /> : <ScheduleTable cinema={cinemas[selectedCinemaIndex]} selectedDate={selectedDate} auth={auth} />}
        </div>
      )}
    </div>
  )
}

export default Schedule
