import axios from 'axios'
import { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import { AuthContext } from '../context/AuthContext'
import BASE_URL from '../config'
const Purchase = () => {
  const navigate = useNavigate()
  const { auth } = useContext(AuthContext)
  const location = useLocation()
  const showtime = location.state.showtime
  const selectedSeats = location.state.selectedSeats || []
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentDetails, setPaymentDetails] = useState('')

  const onPurchase = async () => {
    if (!paymentMethod || !paymentDetails) {
      toast.error('Enter payment details', { position: 'top-center', autoClose: 2000, pauseOnHover: false })
      return
    }
    setIsPurchasing(true)
    try {
      await axios.post(
        `${BASE_URL}/showtime/${showtime._id}`,
        { seats: selectedSeats, paymentMethod, paymentDetails },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      )
      navigate('/cinema')
      toast.success('Purchase successful!', { position: 'top-center', autoClose: 2000, pauseOnHover: false })
    } catch (error) {
      toast.error(error.response.data.message || 'Error occurred', { position: 'top-center', autoClose: 2000, pauseOnHover: false })
    } finally {
      setIsPurchasing(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-r from-red-50 to-white text-gray-800">
      <Navbar />
      <div className="mx-auto w-full max-w-5xl p-8 bg-white rounded-3xl shadow-2xl mt-10">
        <h1 className="text-3xl font-extrabold text-center mb-6">Confirm Your Purchase</h1>
        <ShowtimeDetails showtime={showtime} />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-100 p-6 rounded-xl shadow-inner">
            <h2 className="text-xl font-bold mb-4">Your Selection</h2>
            <p className="mb-2">Selected Seats: <span className="font-semibold">{selectedSeats.join(', ')}</span></p>
            {!!selectedSeats.length && <p className="text-sm text-gray-500">Total Seats: {selectedSeats.length}</p>}
          </div>
          <div className="bg-gray-100 p-6 rounded-xl shadow-inner">
            <h2 className="text-xl font-bold mb-4">Payment Information</h2>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-lg border-gray-300 p-3 mb-4 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Choose Payment Method</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </select>
            {paymentMethod && (
              <input
                type="text"
                placeholder={paymentMethod === 'upi' ? 'Enter UPI ID' : 'Enter Card Number'}
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                className="w-full rounded-lg border-gray-300 p-3 mb-4 focus:ring-2 focus:ring-blue-400"
              />
            )}
            {!!selectedSeats.length && (
              <button
                onClick={onPurchase}
                className="w-full bg-gradient-to-r from-red-500 to-indigo-500 text-white py-3 rounded-lg text-lg font-medium hover:opacity-90 disabled:opacity-50"
                disabled={isPurchasing}
              >
                {isPurchasing ? 'Processing...' : 'Complete Purchase'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Purchase
