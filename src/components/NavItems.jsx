import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm } from '@fortawesome/free-solid-svg-icons'
import { faTv } from '@fortawesome/free-solid-svg-icons'
import { faGamepad } from '@fortawesome/free-solid-svg-icons'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { BrowserRouter, NavLink } from 'react-router-dom'

export default function NavItems({setIsOpen, setViewType, setIsGame}) {

    const activeStyles = {
        color: '#fca311',
        fontWeight: 'bold'
    }

    return(<div className='menu-items'>
                
                <div className='menu-item'>
                    <NavLink 
                        to='/movies' 
                        style={({isActive}) => isActive ? activeStyles : null}
                        onClick={() => {
                            setIsOpen(false)
                            setViewType('movie')
                        }}
                    >
                            <span className='icon'><FontAwesomeIcon icon={faFilm}/></span>
                            <span className='label'>Movies</span>
                    </NavLink>
                </div>
                <div className='menu-item'>
                    <NavLink 
                        to='/shows' 
                        style={({isActive}) => isActive ? activeStyles : null}
                        onClick={() => {
                            setIsOpen(false)
                            setViewType('tv')
                        }}    
                    >
                            <span className='icon'><FontAwesomeIcon icon={faTv}/></span>
                            <span className='label'>TV Shows</span>
                    </NavLink>
                </div>
                <div className='menu-item'>
                    <NavLink 
                        to='/watchlist' 
                        style={({isActive}) => isActive ? activeStyles : null}
                        onClick={() => {setIsOpen(false)}}    
                    >
                            <span className='icon'><FontAwesomeIcon icon={faBookmark}/></span>
                            <span className='label'>Watchlist</span>
                    </NavLink>
                </div>
            </div>)
}