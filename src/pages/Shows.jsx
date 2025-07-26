import Searchbar from "../components/Searchbar";
import { useEffect } from "react";
import ImageSlider from "../components/ImageSlider";
import PopularMovies from "../components/PopularMovies";

export default function Shows({isDesktop, viewType, setViewType}) {
    useEffect(() => {
        setViewType('tv')
    },[viewType])

                
    return(
        <>
            {isDesktop && <Searchbar type='show'/>}
            {!isDesktop && <ImageSlider viewType={viewType} heading='airing_today'/>}
            {isDesktop && <PopularMovies viewType={viewType} type='airing_today' name='Airing Today' show_movies={false} page='1' isDesktop={isDesktop}/>}
            <PopularMovies viewType={viewType} type='on_the_air' name='On The Air' page='2' isDesktop={isDesktop}/>
            <PopularMovies viewType={viewType} type='popular' name='Popular' page='1' show_tv={true} isDesktop={isDesktop}/>
            <PopularMovies viewType={viewType} type='top_rated' name='Top Rated' page='1' show_tv={true} isDesktop={isDesktop}/> 
        </>
        
    )
}