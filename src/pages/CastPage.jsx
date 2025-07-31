import { useEffect, useState } from "react";
import {Link, useParams} from 'react-router-dom'
import ShowMoreText from 'react-show-more-text'


export default function CastPage() {

    const [castDetails, setCastDetails] = useState([])
    const [movieList, setMovieList] = useState([])

    const params = useParams()

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: import.meta.env.VITE_TMDB_API
        }
    };


    useEffect(() => {
        console.log('Useeffect is running...')
        fetch(`https://api.themoviedb.org/3/person/${params.id}?language=en-US`, options)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setCastDetails(data)
            })
            .catch(err => console.error(err));

        fetch(`https://api.themoviedb.org/3/person/${params.id}/movie_credits?language=en-US`, options)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                setMovieList(res.cast.filter(movie => movie.poster_path !== null))
            })
            .catch(err => console.error(err));
    }, [])

    console.log(castDetails)

    return(
        <>
            
            <div className="cast-name-photo">
                <img className="cast-photo" src={`https://image.tmdb.org/t/p/original${castDetails.profile_path}`} alt="" />
                <h1 className="cast-title">{castDetails.name}</h1>
            </div>
            <div className="cast-detail">
                <span className="heading">Known For</span>
                <span className="value">{castDetails.known_for_department}</span>
                <span className="heading">Birthday</span>
                <span className="value">{castDetails.birthday}</span>
                <span className="heading">Place of Birth</span>
                <span className="value">{castDetails.place_of_birth}</span>
            </div>

            <div className="bio-container">
                <div className="biography-container">
                    <span className="biography-heading">Biography</span>
                    <ShowMoreText
                        lines={4}
                        className="review biography"
                        anchorClass="review-link"
                    >
                        {castDetails.biography}
                    </ShowMoreText>
                    {/* {<p className="biography">{castDetails.biography}</p>} */}
                </div>
                <div className="also_known_as">
                    <span className="biography-heading also">Also Known As</span>
                    {castDetails.also_known_as?.map(name => (
                        <span className="also_name">{name}</span>
                    ))}
                </div>
                <div className="popular-container recommendation-container acted-in">
                    <span className="biography-heading performed">Performed in</span>
                    <div className="recommended performed-posters">
                        {movieList.map(movie => (
                            <div>
                                <Link to={`/movies/${movie.id}`}>
                                    <img className="popular-movie-poster recommended-movie-poster" src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={movie.title} />
                                    <span className="popular-movie-title">{movie.title || movie.name}</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                    
                </div>
            </div>
            
        </>
        
    )
}