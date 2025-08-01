import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";

export default function Backdrops({id, setBackdropCount}) {

    const [backdrops, setBackdrops] = useState([])
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
                setBackdrops(data.backdrops)
            })
            .catch(err => console.error(err));
    },[id, type])

    useEffect(() => {
        setBackdropCount(backdrops.length)
    }, [backdrops])

    return(
        <div className="image-container">
            <div className="images">
                {backdrops.map(backdrop => (
                    <div key={backdrop.file_path}>
                        <img className="backdrop" src={`https://image.tmdb.org/t/p/original${backdrop.file_path}`} alt="" />
                    </div>
                ))}
            </div>
        </div>
    )
}