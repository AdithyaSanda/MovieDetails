import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function CastDetails({id}) {
    
    const [cast, setCast] = useState([])
    const [crew, setCrew] = useState([])

    const location = useLocation()
    const type = location.pathname.slice(1, 6)

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: import.meta.env.VITE_TMDB_API
        }
    };

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/${type === 'movie' ? 'movie' : 'tv'}/${id}/credits?language=en-US`, options)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                setCast(res.cast)
                setCrew(res.crew)
            })
            .catch(err => console.error(err));
    },[id, type])

    const directors = crew.filter(c => c.job === 'Director')

    // <>
    //     <span className="director-heading">Director</span>
    //     <span key={c.id} className="director-name">{c.name}</span>
    // </>
    
    return(
        <>
            <div className="director-detail">
                {directors.length > 0 && (
                    <>
                        <span className="director-heading">Director</span>
                        <span>{directors.map(d => d.name).join(', ')}</span>
                    </>
                )}
            </div>
            <div className="cast-container">
                <span className="cast-heading">Cast</span>
                <div className="cast">
                    {cast.map(c => (
                        <div key={c.id}>  
                            <div className="cast-details" >
                                {c.profile_path ? <img className="cast-profile" src={`https://image.tmdb.org/t/p/original${c.profile_path}`} alt="" /> : <img className="cast-profile" src={`https://placehold.co/160x160?text=${c.name}`} alt="" />}
                                <span className="cast-name">{c.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
        
    )


}