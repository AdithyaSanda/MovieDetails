import Searchbar from "../components/Searchbar";
import ImageSlider from "../components/ImageSlider";
import PopularMovies from "../components/PopularMovies";
import { useEffect } from "react";


export default function Movies({isDesktop, viewType, setViewType}) {
    
    useEffect(() => {
        setViewType('movie')
    },[viewType])


                
    return(
        <>
            {isDesktop && <Searchbar type='movie'/>}
            {!isDesktop && <ImageSlider viewType={viewType} heading='now_playing'/>}
            {isDesktop && <PopularMovies viewType={viewType} type='now_playing' name='Now Playing' show_movies={false} page='1' isDesktop={isDesktop}/>}
            <PopularMovies viewType={viewType} type='popular' name='Popular' show_movies={true} page='2' isDesktop={isDesktop}/>
            <PopularMovies viewType={viewType} type='top_rated' name='Top Rated' show_movies={true} page='1' isDesktop={isDesktop}/>
            <PopularMovies viewType={viewType} type='upcoming' name='Upcoming' show_movies={true} page='1' isDesktop={isDesktop}/>  
        </>
        
    )
}       

