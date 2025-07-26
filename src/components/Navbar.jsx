import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import NavItems from './NavItems'



export default function Navbar({isOpen, setIsOpen, setViewType, setIsGame}) {

    

    return(
        <div className={`side-bar ${isOpen ? 'open' : ''}`}>
            <div className='close'>
                <button onClick={() => setIsOpen(false)} >
                    <FontAwesomeIcon className='close-btn'  icon={faXmark}/>
                </button>
            </div>
            
            
            <NavItems setViewType={setViewType} setIsOpen={setIsOpen} setIsGame={setIsGame}/>
            


        </div>
    )
}