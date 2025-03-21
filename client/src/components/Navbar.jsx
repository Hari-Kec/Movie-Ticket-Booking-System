import {
    ClockIcon,
    FilmIcon,
    HomeModernIcon,
    MagnifyingGlassIcon,
    TicketIcon,
    UsersIcon,
    VideoCameraIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import BASE_URL from '../config'
const Navbar = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggingOut, SetLoggingOut] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const navigate = useNavigate();

    const onLogout = async () => {
        try {
            SetLoggingOut(true);
            await axios.get('${BASE_URL}/auth/logout');
            setAuth({ username: null, email: null, role: null, token: null });
            sessionStorage.clear();
            navigate('/');
            toast.success('Logout successful!', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } catch (error) {
            console.error(error);
            toast.error('Error', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false,
            });
        } finally {
            SetLoggingOut(false);
        }
    };

    const menuLists = () => {
        return (
            <>
                <div className="flex flex-col gap-2 lg:flex-row font-medium text-sm">
                    <Link
                        to={'/cinema'}
                        className={`flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 ${
                            window.location.pathname === '/cinema' ? 'bg-indigo-50 text-indigo-700' : ''
                        }`}
                    >
                        <HomeModernIcon className="h-5 w-5" />
                        <p>Cinema</p>
                    </Link>
                    <Link
                        to={'/schedule'}
                        className={`flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 ${
                            window.location.pathname === '/schedule' ? 'bg-indigo-50 text-indigo-700' : ''
                        }`}
                    >
                        <ClockIcon className="h-5 w-5" />
                        <p>Schedule</p>
                    </Link>
                    {auth.role && (
                        <Link
                            to={'/ticket'}
                            className={`flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 ${
                                window.location.pathname === '/ticket' ? 'bg-indigo-50 text-indigo-700' : ''
                            }`}
                        >
                            <TicketIcon className="h-5 w-5" />
                            <p>Ticket</p>
                        </Link>
                    )}
                    {auth.role === 'admin' && (
                        <>
                            <Link
                                to={'/movie'}
                                className={`flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 ${
                                    window.location.pathname === '/movie' ? 'bg-indigo-50 text-indigo-700' : ''
                                }`}
                            >
                                <VideoCameraIcon className="h-5 w-5" />
                                <p>Movie</p>
                            </Link>
                            <Link
                                to={'/search'}
                                className={`flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 ${
                                    window.location.pathname === '/search' ? 'bg-indigo-50 text-indigo-700' : ''
                                }`}
                            >
                                <MagnifyingGlassIcon className="h-5 w-5" />
                                <p>Search</p>
                            </Link>
                            <Link
                                to={'/user'}
                                className={`flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 ${
                                    window.location.pathname === '/user' ? 'bg-indigo-50 text-indigo-700' : ''
                                }`}
                            >
                                <UsersIcon className="h-5 w-5" />
                                <p>User</p>
                            </Link>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {auth.username && (
                        <div className="flex items-center gap-2">
                            <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                            <p className="text-sm font-semibold text-gray-700">Welcome, {auth.username}!</p>
                        </div>
                    )}
                    {auth.token ? (
                        <button
                            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-all duration-200 disabled:bg-gray-400"
                            onClick={() => onLogout()}
                            disabled={isLoggingOut}
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </button>
                    ) : (
                        <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-all duration-200">
                            <Link to={'/login'} className="flex items-center gap-2">
                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                Login
                            </Link>
                        </button>
                    )}
                </div>
            </>
        );
    };

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo and Hamburger Menu */}
                    <div className="flex items-center">
                        <button
                            className="flex items-center gap-2 text-2xl font-bold text-indigo-700"
                            onClick={() => navigate('/')}
                        >
                            <FilmIcon className="h-8 w-8 text-indigo-600" />
                            <span className="hidden sm:block">Cinema</span>
                        </button>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex lg:items-center lg:gap-6">{menuLists()}</div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex lg:hidden">
                        <button
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none"
                            onClick={toggleMenu}
                        >
                            {menuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="lg:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2">{menuLists()}</div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;