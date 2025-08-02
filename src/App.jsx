import Header from "./components/Header";
import { Routes, Route, Navigate} from 'react-router-dom'
import { useLocation } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from 'react'
import Backdrops from "./components/Backdrops";
import Posters from "./components/Posters";
import Video from "./components/Video";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import CastPage from "./pages/CastPage";
import ErrorPage from "./pages/ErrorPage";
import LoadingPage from "./pages/LoadingPage";


const Movies = lazy(() => import('./pages/Movies.jsx'))
const Shows = lazy(() => import('./pages/Shows.jsx'))
const MovieDetail = lazy(() => import('./pages/MovieDetail.jsx'))
const Watchlist = lazy(() => import('./pages/Watchlist.jsx'))


export default function App() {

    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1228)
    const [viewType, setViewType] = useState('movie')
    const [isGame, setIsGame] = useState(false)
    const [backdropCount, setBackdropCount] = useState(0)
    const [posterCount, setPosterCount] = useState(0)
    const [videoCount, setVideoCount] = useState(0)

    const location = useLocation()

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1228)
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)

    }, [])

    return(
        <>
           
            <Header isGame={isGame} setIsGame={setIsGame} viewType={viewType} setViewType={setViewType} isDesktop={isDesktop}/>
       
            <Suspense fallback={<LoadingPage />}>

                <Routes>
                    
                    <Route path="/" element={<Navigate to="/movies"/>}/>
                    <Route path="/signin" element={<Signin />}/>
                    <Route path="/signup" element={<Signup />}/>
                    
                    <Route path="/movies" element={<Movies isDesktop={isDesktop} viewType={viewType} setViewType={setViewType}/>}/>
                    <Route path="/movies/:id" element={<MovieDetail viewType={viewType} backdropCount={backdropCount} posterCount={posterCount} videoCount={videoCount}/>}>
                        <Route index element={<Backdrops id={location.pathname.slice(8)} setBackdropCount={setBackdropCount}/>}/>
                        <Route path="posters" element={<Posters id={location.pathname.slice(8,15)} setPosterCount={setPosterCount}/>}/>
                        <Route path="videos" element={<Video id={location.pathname.slice(8,15)} setVideoCount={setVideoCount}/>}/>
                    </Route>
                    <Route path="/shows" element={<Shows isDesktop={isDesktop} viewType={viewType} setViewType={setViewType}/>}/>
                    <Route path="/shows/:id" element={<MovieDetail viewType={viewType} backdropCount={backdropCount} posterCount={posterCount} videoCount={videoCount}/>}>
                        <Route index element={<Backdrops id={location.pathname.slice(7)} setBackdropCount={setBackdropCount}/>}/>
                        <Route path="posters" element={<Posters id={location.pathname.slice(7,11)} setPosterCount={setPosterCount}/>}/>
                        <Route path="videos" element={<Video id={location.pathname.slice(7,11)} setVideoCount={setVideoCount}/>}/>
                    </Route>
                    <Route path="/person/:id" element={<CastPage />}/>
                    <Route path="/watchlist" element={
                        <ProtectedRoute>
                            <Watchlist />
                        </ProtectedRoute>
                        
                    } />
                <Route path="*" element={<ErrorPage />}/>
                    
                </Routes>
            </Suspense>
        </>
    )
}