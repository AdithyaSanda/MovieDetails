import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
export default function Posters({id, setPosterCount}) {

    const [posters, setPosters] = useState([])
    

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
        fetch(`https://api.themoviedb.org/3/${type === 'movie' ? 'movie' : 'tv'}/${id}/images`, options)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setPosters(data.posters)
            })
            .catch(err => console.error(err));
    },[id])

    useEffect(() => {
        setPosterCount(posters.length)
    }, [posters])

    return(
        <div className="image-container">
            <div className="images">
                {posters ? posters.map(poster => (
                    <img key={poster.file_path} className="poster" src={`https://image.tmdb.org/t/p/original${poster.file_path}`} alt="" />
                )) : null}
            </div>
        </div>
    )
}