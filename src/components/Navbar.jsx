import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom'

import NavItems from './NavItems'



export default function Navbar({isOpen, setIsOpen, setViewType, setIsGame}) {

    

    return(
        <div className={`side-bar ${isOpen ? 'open' : ''}`}>
            <Link to={'/movies'} onClick={() => setIsOpen(false)}>
                <div className='logo-container nav-logo'>
                    <img className='logo' src="/src/assets/logo2.png" alt="nextWatch" />
                    <span className='logo-name'>NextWatch</span>
                </div>
            </Link>
            <div className='close'>
                <button onClick={() => setIsOpen(false)} >
                    <FontAwesomeIcon className='close-btn'  icon={faXmark}/>
                </button>
            </div>
            
            
            <NavItems setViewType={setViewType} setIsOpen={setIsOpen} setIsGame={setIsGame}/>
            


        </div>
    )
}