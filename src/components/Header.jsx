import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Navbar from './Navbar'
import { useState } from 'react'
import NavItems from './NavItems'
import Suggestions from './Suggestions'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'


export default function Header({isDesktop, viewType, setViewType, isGame, setIsGame}) {

    const [isOpen, setIsOpen] = useState(false)
    const [isSearchOn, setIsSearchOn] = useState(false)
    const [movie, setMovie] = useState('')
    const [visible, setVisible] = useState(false)
    const [error, setError] = useState(null)

    const searchBar = document.getElementById('search-bar')
    const {signOutUser, session} = useAuth()
    const navigate = useNavigate()
    
    function onSearch(e) {
        if(e.key === "Enter") {
            setMovie(e.target.value)
            setVisible(true)
        }
    }
   
    const handleSignOut = async (e) => {
        e.preventDefault()

        const {success, error} = await signOutUser()
        if(success) {
            navigate('/signin', {replace: true})
        }
        else {
            setError(error)
        }
    }


    return(
        <>
            <nav className='nav-bar'>
                <div className='menu'>
                    <button onClick={() => setIsOpen(true)}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <Link to={'/movies'}>
                        <div className='logo-container'>
                            <img className='logo' src="/src/assets/logo2.png" alt="nextWatch" />
                            <span className='logo-name'>NextWatch</span>
                        </div>
                    </Link>
                    
                </div>

                {isDesktop && <NavItems />}

                <div className='right-container'>
                    <button onClick={() => setIsSearchOn(true)} className='search-btn'>
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </button>
                    {session ? <button className='sign-out-btn' onClick={handleSignOut}>Sign out</button> : <button className='sign-out-btn' onClick={() => navigate('/signin', {replace: true})}>Sign in</button>}
                </div>
                
                
            </nav>
            <Navbar setViewType={setViewType} isOpen={isOpen} setIsOpen={setIsOpen} setIsGame={setIsGame} />


            <div className={`search-bar ${isSearchOn ? 'open' : ''}`}>
                <input 
                    id='search-bar' 
                    type="text" 
                    placeholder='Search'
                    onKeyDown={(e) => onSearch(e)}
                />
                <button onClick={() => {
                        setIsSearchOn(false)
                        setVisible(false)
                        searchBar.value = ''
                    }
                }>
                    <FontAwesomeIcon icon={faXmark}/>
                </button> 
            </div>

            {visible && !isGame && <Suggestions viewType={viewType} movie={movie} setVisible={setVisible} setIsSearchOn={setIsSearchOn} searchBar={searchBar}/>}
        </>
    )
}