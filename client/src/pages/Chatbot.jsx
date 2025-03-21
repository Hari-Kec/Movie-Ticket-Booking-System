import { useState } from 'react'
import axios from 'axios'
import { Send, Bot, User } from 'lucide-react'
import { motion } from 'framer-motion'
const Chatbot = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [messages, setMessages] = useState([])
	const handleSend = async () => {
		if (!query.trim()) return
		const userMsg = { sender: 'user', text: query }
		setMessages((prev) => [...prev, userMsg])
		const res = await axios.post('https://movie-ticket-booking-system-1-nvtl.onrender.com/chat', { query })
		setMessages((prev) => [...prev, { sender: 'bot', text: res.data.response }])
		setQuery('')
	}
	return (
		<div className="fixed bottom-5 right-5 z-50">
			{isOpen && (
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					className="w-80 max-w-full h-[30rem] bg-gradient-to-br from-white via-gray-100 to-gray-200 rounded-2xl shadow-2xl flex flex-col p-4"
				>
					<div className="text-xl font-bold text-purple-700 mb-3 text-center">AI Chat Assistant</div>
					<div className="flex-1 overflow-y-auto mb-3 space-y-2">
						{messages.map((msg, idx) => (
							<div
								key={idx}
								className={`flex items-start gap-2 ${
									msg.sender === 'user' ? 'justify-end' : 'justify-start'
								}`}
							>
								{msg.sender === 'bot' && <Bot size={20} className="text-purple-500" />}
								<span
									className={`px-3 py-2 rounded-xl max-w-[70%] break-words text-sm ${
										msg.sender === 'user'
											? 'bg-purple-500 text-white font-medium'
											: 'bg-white text-gray-700 shadow'
									}`}
								>
									{msg.text}
								</span>
								{msg.sender === 'user' && <User size={20} className="text-purple-500" />}
							</div>
						))}
					</div>
					<div className="flex gap-2">
						<input
							className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-purple-500 shadow"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Type your message..."
						/>
						<button
							onClick={handleSend}
							className="bg-purple-500 hover:bg-purple-600 transition-all p-2 rounded-xl text-white shadow-lg"
						>
							<Send size={18} />
						</button>
					</div>
				</motion.div>
			)}
			<motion.button
				whileTap={{ scale: 0.9 }}
				className="bg-gradient-to-tr from-purple-600 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform"
				onClick={() => setIsOpen(!isOpen)}
			>
				<Bot size={28} />
			</motion.button>
		</div>
	)
}
export default Chatbot
