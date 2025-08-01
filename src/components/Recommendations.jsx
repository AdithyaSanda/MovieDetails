import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Recommendations({id, viewType}) {

    const [result, setResult] = useState([])

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: import.meta.env.VITE_TMDB_API
        }
    };

    useEffect(() => {
        

        fetch(`https://api.themoviedb.org/3/${viewType === 'movie' ? 'movie' : 'tv'}/${id}/recommendations?language=en-US&page=1`, options)
            .then(res => res.json())
            .then(data => {
                setResult(data.results)
            })
            .catch(err => console.error(err));


    }, [id, viewType])

    return(
            <div className="popular-container recommendation-container">
                <h1 className="recommend-heading">Recommended</h1>
                    
                        <div className=" recommended">
                            {result.map(res => (
                                <div key={res.id}>
                                    <Link to={`/${viewType === 'movie' ? 'movie' : 'show'}s/${res.id}`}>
                                        <img className="popular-movie-poster recommended-movie-poster" src={`https://image.tmdb.org/t/p/original${res.poster_path}`} alt={res.title} />
                                        <span className="popular-movie-title">{res.title || res.name}</span>
                                    </Link>
                                </div>
                            ))} 
                        </div>
         
                      
            </div>
            
            
    )
}