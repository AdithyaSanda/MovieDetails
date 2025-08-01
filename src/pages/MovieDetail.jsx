import { useEffect, useState } from "react";
import { useParams, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import CastDetails from "../components/CastDetails";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import Reviews from "../components/Reviews";
import { useAuth } from "../context/AuthContext";
import supabase from "../supabase-client";
import Recommendations from "../components/Recommendations";
import LoadingPage from "./LoadingPage";


export default function MovieDetail({backdropCount, posterCount, videoCount}) {

    const params = useParams()
    const location = useLocation()
    const type = location.pathname.slice(1, 6)

    const [detailHtml, setDetailHtml] = useState('')
    const [listCount, setListCount] = useState(0)
    const [isInWatchlist, setIsInWatchlist] = useState(false)
    const [isBackdropActive, setIsBackdropActive] = useState(false)
    const [isPosterActive, setIsPosterActive] = useState(false)
    const [isVideoActive, setIsVideoActive] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    

    const navigate = useNavigate()


    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: import.meta.env.VITE_TMDB_API
        }
    };

    const activeStyles = {
        textDecoration: 'underline whitesmoke',
        textUnderlineOffset: '4px',
        fontWeight: 'bold',
    }

    useEffect(() => {
        setIsBackdropActive(!location.pathname.includes('/posters') && !location.pathname.includes('/videos'))
        setIsPosterActive(location.pathname.includes('/posters'))
        setIsVideoActive(location.pathname.includes('/videos'))
    }, [location])

    useEffect(() => {
        window.scrollTo(0,0)
    },[location])

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/${type === 'movie' ? 'movie' : 'tv'}/${params.id}?language=en-US`, options)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setDetailHtml(
                    <>
                        <div className="detail-container">
                            <img className="backdrop-detail" src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`} alt={data.title} />
                            <div className="gray-overlay">
                                
                            </div>
                            <img className="poster-detail" src={`https://image.tmdb.org/t/p/original${data.poster_path}`} alt={data.title} />
                            <span className="title-detail">{data.title || data.name} ({data.release_date ? data.release_date.slice(0, 4) : data.first_air_date.slice(0, 4)})</span>
                            
                        </div>
                        <div className="genre-container">
                            <div>
                                 <span className="runtime-detail">{data.release_date ? data.release_date.slice(8) : data.first_air_date.slice(8)}/{data.release_date ? data.release_date.slice(5, 7) : data.first_air_date.slice(5, 7)}/{data.release_date ? data.release_date.slice(0, 4) : data.first_air_date.slice(0, 4)} (IN) </span>
                                {data.runtime && type === 'movie' && ( <span style={{display: 'inline-block'}}>| {data.runtime} min</span>)}
                                {Array.isArray(data.episode_run_time) && data.episode_run_time.length > 0 && type === 'shows' && (<span style={{display: 'inline-block'}}>| {data.episode_run_time} min</span>)}
                            </div>
                            {data.genres.map((genre, index) => (
                                index === data.genres.length-1 ? <span key={genre} className="genre-detail">{genre.name}</span> : <span key={genre.id} className="genre-detail">{genre.name}, </span>
                            ))}
                        </div>
                        <div className="overview-container">
                            <span className="tagline">{data.tagline}</span>
                            <span className="overview-heading">Overview</span>
                            <span className="overview">{data.overview}</span>
                        </div>
                        
                        <CastDetails id={data.id}/>
                        
                        <div className="media">
                            <span className="media-heading">Media</span>
                            <NavLink end style={({isActive}) => isActive ? activeStyles : null} className="image-heading link" to=".">Backdrops</NavLink>
                            {isBackdropActive && <span className="backdrop-count">{backdropCount}</span> }

                            
                            <NavLink style={({isActive}) => isActive ? activeStyles : null} className="image-heading link" to="posters">Posters</NavLink>
                            {isPosterActive && <span className="backdrop-count">{posterCount}</span>}
                            <NavLink style={({isActive}) => isActive ? activeStyles : null} className="link" to="videos">Videos</NavLink>
                            {isVideoActive && <span className="backdrop-count video-count">{videoCount}</span>}
                            <Outlet />
                        </div>
                        
                        <Reviews id={data.id} />

                        <Recommendations id={data.id} viewType={type}/>
                    </>
                )
                setIsLoading(false)
            })
            .catch(err => console.error(err));
    }, [params, type])

    const {getUserId, session} = useAuth()
    async function handleAddToWatchList() {
        
        const userid = await getUserId()
        if(!userid) {
            console.error('user id not found')
            return
        }

        try {
            const {error} = await supabase
            .from('watchlist')
            .insert([
                {user_id: userid, movie_id: params.id, type: type}
            ])

            if(error) {
                console.error(error)
            }
            else {
                console.log('Movie added to watchlist')
                setIsInWatchlist(true)
            }
        }
        catch(error) {
            console.error(error)
        }
    }

    useEffect(() => {

        async function isAddedToWatchlist() {
            const {count, error} = await supabase
            .from('watchlist')
            .select("id", {count: "exact", head: true}) 
            .eq("movie_id", params.id)

            if(error) {
                console.error(error)
                return
            }

            setListCount(count)
        }

        isAddedToWatchlist()

    }, [])



    const isInsideWatchlist = listCount > 0

    return !isLoading ? (
        <>
            {detailHtml}
            <button className="back-btn" onClick={() => {type === 'movie' ? navigate("/movies") : navigate("/shows")}}>
                <FontAwesomeIcon icon={faArrowLeft}/>
            </button>
            <button className="back-btn watchlist-btn" style={{color: isInWatchlist || isInsideWatchlist ? "#fca311" : "whitesmoke"}}  onClick={() =>{session ? handleAddToWatchList() : navigate('/signin')}}>
                <FontAwesomeIcon icon={faBookmark}/>
            </button>
        </>
    ) : (
        <LoadingPage />
    )
}