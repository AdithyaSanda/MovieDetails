import { useEffect, useState } from "react";
import {Link, useParams} from 'react-router-dom'
import ShowMoreText from "../components/ShowMoreText";
import LoadingPage from "./LoadingPage";


export default function CastPage() {

    const [castDetails, setCastDetails] = useState([])
    const [movieList, setMovieList] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const params = useParams()

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: import.meta.env.VITE_TMDB_API
        }
    };


    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/person/${params.id}?language=en-US`, options)
            .then(res => res.json())
            .then(data => {
                setCastDetails(data)
            })
            .catch(err => console.error(err));

        fetch(`https://api.themoviedb.org/3/person/${params.id}/movie_credits?language=en-US`, options)
            .then(res => res.json())
            .then(res => {
                setMovieList(res.cast.filter(movie => movie.poster_path !== null))
                setIsLoading(false)
            })
            .catch(err => console.error(err));
    }, [params.id])



    return !isLoading ? (
        <>
            
            <div className="cast-name-photo">
                {castDetails.profile_path ? <img className="cast-photo" src={`https://image.tmdb.org/t/p/w500${castDetails.profile_path}`} alt="" /> : <img className="cast-photo" src={`https://placehold.co/150x225?text=${castDetails.name}`} alt="" />}
                <h1 className="cast-title">{castDetails.name}</h1>
            </div>
            <div className="cast-detail">
                <span className="heading">Known For</span>
                {castDetails.known_for_department ? <span className="value">{castDetails.known_for_department}</span> : <span className="value">N/A</span>}
                <span className="heading">Birthday</span>
                {castDetails.birthday ? <span className="value">{castDetails.birthday}</span> : <span className="value">N/A</span>}
                <span className="heading">Place of Birth</span>
                {castDetails.place_of_birth ? <span className="value">{castDetails.place_of_birth}</span> : <span className="value">N/A</span>}
            </div>

            <div className="bio-container">
                {castDetails.biography && <div className="biography-container">
                    <span className="biography-heading">Biography</span>
                    <ShowMoreText style='biography' text={castDetails.biography} maxChars={550}/>
                </div>}
                {castDetails.also_known_as?.length ? <div className="also_known_as">
                    <span className="biography-heading also">Also Known As</span>
                    {castDetails.also_known_as?.map(name => (
                        <span key={castDetails.id} className="also_name">{name}</span>
                    ))}
                </div> : null}
                <div className="popular-container recommendation-container acted-in">
                    <span className="biography-heading performed">Performed in</span>
                    <div className="recommended performed-posters">
                        {movieList.map(movie => (
                            <div key={movie.id}>
                                <Link to={`/movies/${movie.id}`}>
                                    <img className="popular-movie-poster recommended-movie-poster" src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={movie.title} loading="lazy"/>
                                    <span className="popular-movie-title">{movie.title || movie.name}</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                    
                </div>
            </div>
            
        </>
        
    ) : (
        <LoadingPage />
    )
}