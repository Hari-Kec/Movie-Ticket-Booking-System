import axios from 'axios'
import { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import { AuthContext } from '../context/AuthContext'

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
      toast.error('Please enter payment details', { position: 'top-center', autoClose: 2000, pauseOnHover: false })
      return
    }
    setIsPurchasing(true)
    try {
      await axios.post(
        `/showtime/${showtime._id}`,
        { seats: selectedSeats, paymentMethod, paymentDetails },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      )
      navigate('/cinema')
      toast.success('Purchase successful!', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false
      })
    } catch (error) {
      toast.error(error.response.data.message || 'Error occurred', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white pb-10">
      <Navbar />
      <div className="mx-auto my-6 w-11/12 rounded-xl bg-gray-50 p-6">
        <ShowtimeDetails showtime={showtime} />
        <div className="mt-6 flex flex-col gap-4 rounded-xl border-t border-gray-300 p-4">
          <div>
            <p className="text-lg font-bold">Selected Seats:</p>
            <p className="text-gray-700">{selectedSeats.join(', ')}</p>
            {!!selectedSeats.length && <p className="text-sm text-gray-500">({selectedSeats.length} seats)</p>}
          </div>
          <div className="flex flex-col gap-4">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="rounded-md border p-2"
            >
              <option value="">Select Payment Method</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </select>
            {paymentMethod && (
              <input
                type="text"
                placeholder={paymentMethod === 'upi' ? 'Enter UPI ID' : 'Enter Card Number'}
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                className="rounded-md border p-2"
              />
            )}
            {!!selectedSeats.length && (
              <button
                onClick={onPurchase}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-500 disabled:opacity-50"
                disabled={isPurchasing}
              >
                {isPurchasing ? 'Processing...' : 'Confirm Purchase'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Purchase