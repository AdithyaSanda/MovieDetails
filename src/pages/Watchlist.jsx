import { useEffect, useState } from "react"
import supabase from "../supabase-client"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from "../context/AuthContext"
import LoadingPage from "./LoadingPage"


export default  function Watchlist() {

    const [watchlist, setWatchlist] = useState([])
    const [list, setList] = useState([])
    const [userId, setUserId] = useState()
    const [isLoading, setIsLoading] = useState(true)

    const {getUserId} = useAuth()

    useEffect(() => {
        async function fetchUserid() {
            const userid = await getUserId()
            setUserId(userid)
        }

        fetchUserid()
    }, [])
    

    useEffect( () => {
        async function getWatchList() {
            try {
                const {data, error} = await supabase
                .from('watchlist')
                .select('movie_id, type')

                if(error) {
                    console.error(error)
                    return
                }

                setWatchlist(data)
            }
            catch(error) {
                console.error(error)
                return
            }
        }

        getWatchList()

        
        
    },[])

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: import.meta.env.VITE_TMDB_API
        }
    };


    useEffect(() => {

        async function getMovieDetails() {
            if(watchlist.length === 0) return
            
            try {
                const responses = await Promise.all(
                    watchlist.map(async (item) => {
                        const res = await fetch(`https://api.themoviedb.org/3/${item.type === 'movie' ? 'movie' : 'tv'}/${item.movie_id}?language=en-US`, options)
                        const data = await res.json()
                        return {...data, type: item.type}
                    })
                )

                setList(responses)
                setIsLoading(false)
            }
            catch(error) {
                console.error(error)
            }
            
        }

        getMovieDetails()

        const channel = supabase
            .channel('reviews-changes')
            .on(
                'postgres_changes',
                {
                event: '*',
                schema: 'public',
                table: 'watchlist',
                },
                (payload) => {
                setList((prev) => [...prev, payload.new]);
                }
            )
            .subscribe();


            return () => {
            supabase.removeChannel(channel);
            };
        
        
            

    }, [watchlist])

    async function handleDeleteWatchlist(movieId) {
        try {
            const {error} = await supabase
            .from('watchlist')
            .delete()
            .eq('movie_id', movieId)

            if(error) {
                console.error(error)
                return
            }
            else {
                setList(prev => prev.filter(r => r.id !== movieId))
            }
        }
        catch(error) {
            console.error(error)
        }
    }

    return !isLoading ? (
        <>
            <h1 className="watchlist-heading">Watchlist</h1>  
            <div className="watchlist-container">
                <div className="watchlist">
                    {list.map(movie => (
                        <>
                        {movie.id && <button className="delete-review-btn" onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleDeleteWatchlist(movie.id)
                        }}>
                            <FontAwesomeIcon  icon={faTrash}/>
                        </button>}
                        {movie.id && <Link key={movie.id} to={`/${movie.type === 'movie' ? 'movie' : 'show'}s/${movie.id}`}>
                            <div className="suggestion-details">
                                <div>
                                    {movie.poster_path && <img className="suggestion-poster watchlist-poster" src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={movie.title} />}
                                </div>
                                <div className="suggestion-movie-details">
                                    <span className="suggested-movie-title">{movie.title || movie.name} ({movie.release_date ? movie.release_date.slice(0, 4) : movie.first_air_date.slice(0, 4)})</span>
                                    
                                    <span className="suggested-movie-overview">{movie.overview}</span>
                                </div>
                            </div>
                        </Link>}
                        
                        </>
                        
                        
                    ))}
                </div>
            </div>
        </>
        
        
    ) : (
        <LoadingPage />
    )
}