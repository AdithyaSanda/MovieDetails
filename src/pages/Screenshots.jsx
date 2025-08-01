import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";

export default function Screenshots() {
    const [backdrops, setBackdrops] = useState([])
    const location = useLocation()
    const id = location.pathname.slice(7)
    
    useEffect(() => {
        fetch(`https://api.rawg.io/api/games/${id}/screenshots?&key=${import.meta.env.VITE_RAWG_API}`)
            .then(res => res.json())
            .then(data => {
                setBackdrops(data.results)
            })
            .catch(err => console.error(err));
    },[])

    return(
        <div className="image-container">
            <div className="images">    
                {backdrops.map(backdrop => (
                    <div key={backdrop.id}>
                        <img className="backdrop" src={backdrop.image} alt="" />
                    </div>
                ))}
            </div>
        </div>
    )
}