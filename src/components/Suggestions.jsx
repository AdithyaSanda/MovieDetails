import { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom'

export default function Suggestions({movie, setVisible, setIsSearchOn, searchBar, type, viewType}) {

    const [movieList, setMovieList] = useState([])
    const location = useLocation()
    const movieOrShow = location.pathname.slice(1, 6)
    
    
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: import.meta.env.VITE_TMDB_API
        }
    };

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/search/${movieOrShow === 'movie' ? 'movie' : 'tv'}?query=${movie}&include_adult=false&language=en-US&page=1`, options)
            .then(res => res.json())
            .then(data => {
                setMovieList(data.results.filter(result => result.backdrop_path && result.poster_path))
            })
            .catch(err => console.error(err));
    }, [movie])

    return(
        <div id="suggestion-container" className="suggestion-container">
            <div className="suggestion">
                {movieList.map(movie => (
                    <Link key={movie.id} onClick={() => {
                            setVisible(false)
                            setIsSearchOn(false)
                            searchBar.value = ''
                        }} 
                        to={`/${movieOrShow === 'movie' ? 'movies' : 'shows'}/${movie.id}`}
                    >
                        <div className="suggestion-details">
                            <img className="suggestion-poster" src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={movie.title} />
                            <div className="suggestion-movie-details">
                                {movie.title || movie.name && <span className="suggested-movie-title">{movie.title || movie.name} ({movie.release_date ? movie.release_date.slice(0, 4) : movie.first_air_date.slice(0, 4)})</span>}
                                <span className="suggested-movie-overview">{movie.overview}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )

}