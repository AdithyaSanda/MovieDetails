import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import SkeletonHolder from "./SkeletonHolder";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

export default function PopularMovies({viewType, type, name, show_movies, page, isDesktop, show_tv}) {

    const [result, setResult] = useState([])
    const [startIndex, setStartIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const postersPerPage = 7


    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: import.meta.env.VITE_TMDB_API
        }
    };

    useEffect(() => {


        let isActive = true

        fetch(`https://api.themoviedb.org/3/${viewType}/${type}?language=en-US&page=${page}`, options)
            .then(res => res.json())
            .then(data => {
                if(isActive) {
                    setResult(data.results)
                    setIsLoading(false)
                }
            })
            .catch(err => {
                if(isActive) {
                    console.error(err)
                }    
            });
            
            return () => {
                isActive = false
            }
            
    },[viewType, type, page])
    
    const handleNext = () => {
        if(startIndex + postersPerPage < result.length) {
            setStartIndex(startIndex + postersPerPage)
        }
    }

    const handlePrev = () => {
        if(startIndex - postersPerPage >= 0) {
            setStartIndex(startIndex - postersPerPage)
        }
    }

    const visiblePosters = isDesktop ? result.slice(startIndex, startIndex + postersPerPage) : result

    
    return(
            <div className="popular-container">
                <h1 className="popular-heading">{name} {show_movies && `Movies`} {show_tv && 'Shows'}</h1>
                <button className="left-btn" onClick={handlePrev}><FontAwesomeIcon icon={faAngleLeft}/></button>
                <button className="right-btn" onClick={() => {handleNext()}}><FontAwesomeIcon icon={faAngleRight}/></button>
                    <div className="popular">
                        {isLoading ? (<SkeletonHolder count={postersPerPage}/>)  : visiblePosters.map(res => (
                            <div key={res.id}>
                                <Link to={`/${viewType === 'tv' ? 'show' : 'movie'}s/${res.id}`}>
                                    <img className="popular-movie-poster" src={`https://image.tmdb.org/t/p/w185${res.poster_path}`} alt={res.title} />
                                    <span className="popular-movie-title">{res.title || res.name}</span>
                                </Link>
                            </div>
                        ))} 
                    </div>  
            </div>
            
            
    )
    

}