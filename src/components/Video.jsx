import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Video({id, setVideoCount}) {

    const [videos, setVideos] = useState([])
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
        fetch(`https://api.themoviedb.org/3/${type === 'movie' ? 'movie' : 'tv'}/${id}/videos?language=en-US`, options)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setVideos(data.results.slice(0, 21))
            })
            .catch(err => console.error(err));
    }, [id])

    useEffect(() => {
        setVideoCount(videos.length)
    }, [videos])
    
    
    return(
        <div className="video-container">
            <div className="videos">
                {videos.map(video => (
                    <iframe 
                        className="video"
                        loading="lazy"
                        key={video.id}
                        src={`https://www.youtube.com/embed/${video.key}`} 
                        frameBorder="0"
                        width="220px"
                        title={video.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ))}
            </div>
        </div>
    )
}