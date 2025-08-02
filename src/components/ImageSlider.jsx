import { useState, useEffect} from 'react'
import { useSwipeable } from "react-swipeable";
import { Link } from 'react-router-dom'
import Skeleton from "react-loading-skeleton";
export default function ImageSlider({viewType, heading}) {


    const [result, setResult] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: import.meta.env.VITE_TMDB_API
        }
    };

    useEffect(() => {

        if(!viewType) return

        fetch(`https://api.themoviedb.org/3/${viewType}/${heading}?language=en-US&page=1`, options)
            .then(res => res.json())
            .then(data => {
                setResult(data.results.filter(result => result.backdrop_path))
                setIsLoading(false)

            })
            .catch(err => console.error(err));
    },[viewType])



    const [current, setCurrent] = useState(0)

    const nextSlide = () => {
        setCurrent(prev => (prev + 1) % result.length)
    }

    const prevSlide = () => {
        setCurrent(prev => (prev - 1 + result.length) % result.length)
    }

    const handlers = useSwipeable({
        onSwipedLeft: nextSlide,
        onSwipedRight: prevSlide,
        trackTouch: true,
        trackMouse: false,
    })

    useEffect(() => {
        const id = setInterval(nextSlide, 5000)

        return () =>  clearInterval(id)
    },[result.length])
    
    

    return(
        <div className='top-container'{...handlers}>
            {isLoading && <div className='skeleton-container'>
                <Skeleton height={250} baseColor="#313131" highlightColor="#525252"/>
            </div>}
            {!isLoading && <div className="now-playing-container" >
                
                {result.map((res, index) => (
                    <Link key={res.id} to={`/${viewType === 'tv' ? 'show' : 'movie'}s/${res.id}`}>
                        <div className="now-playing" style={{translate: `${-100 * current}%`}}>
                                <img key={index} src={`https://image.tmdb.org/t/p/w1280${res.backdrop_path}`} alt={res.title}/>
                                <span>{res.title || res.name} ({res.release_date ? res.release_date.slice(0, 4) : res.first_air_date.slice(0, 4)})</span>
                        </div>
                    </Link>
                ))}
            </div>}
        </div>
        
    )
}