import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';

const NowShowing = ({ movies, selectedMovieIndex, setSelectedMovieIndex, auth, isFetchingMoviesDone }) => {
    return (
        <div className="mx-4 flex flex-col rounded-lg bg-gray-800 p-4 text-white shadow-2xl sm:mx-8 sm:p-6">
            <h2 className="text-3xl font-bold text-white">Now Showing</h2>
            {isFetchingMoviesDone ? (
                movies.length ? (
                    <div className="mt-4 overflow-x-auto sm:mt-6">
                        <div className="mx-auto flex w-fit gap-4">
                            {movies?.map((movie, index) => {
                                return movies[selectedMovieIndex]?._id === movie._id ? (
                                    <div
                                        key={index}
                                        title={movie.name}
                                        className="flex w-[108px] flex-col rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 p-1 text-white shadow-lg hover:from-indigo-500 hover:to-blue-400 transition-all duration-200 sm:w-[144px]"
                                        onClick={() => {
                                            setSelectedMovieIndex(null);
                                            sessionStorage.setItem('selectedMovieIndex', null);
                                        }}
                                    >
                                        <img
                                            src={movie.img}
                                            className="h-36 rounded-lg object-cover shadow-md sm:h-48"
                                            alt={movie.name}
                                        />
                                        <p className="truncate pt-2 text-center text-sm font-semibold leading-4">
                                            {movie.name}
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        key={index}
                                        className="flex w-[108px] flex-col rounded-lg bg-gray-700 p-1 text-gray-200 shadow-lg hover:bg-gradient-to-br hover:from-indigo-500 hover:to-blue-400 hover:text-white transition-all duration-200 sm:w-[144px]"
                                        onClick={() => {
                                            setSelectedMovieIndex(index);
                                            sessionStorage.setItem('selectedMovieIndex', index);
                                        }}
                                    >
                                        <img
                                            src={movie.img}
                                            className="h-36 rounded-lg object-cover shadow-md sm:h-48"
                                            alt={movie.name}
                                        />
                                        <p className="truncate pt-2 text-center text-sm font-semibold leading-4">
                                            {movie.name}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <p className="mt-4 text-center text-gray-400">There are no movies available</p>
                )
            ) : (
                <Loading />
            )}
        </div>
    );
};

export default NowShowing;