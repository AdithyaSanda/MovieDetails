import { useRef, useState } from "react"
import Suggestions from "./Suggestions"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'



export default function Searchbar({type, isGame}) {

    const [movie, setMovie] = useState('')
    const [visible, setVisible] = useState(false)
    const [searchText, setSearchText] = useState('')

    const searchBar = document.getElementById("search-bar")
    const searchBarRef = useRef(null)   

    function onSearch(e) {
        if(e.key === 'Enter') {
            setMovie(e.target.value)
            setVisible(true)
        }
    }

    function clearSearch() {
        if(searchBarRef.current) {
            searchBarRef.current.value = ''
        }
    }


    return(
        <>
            <div className="search-container">
                <h1>Find your {type}</h1>
            </div>
            <div className="search-bar-main">
                <input ref={searchBarRef} autoComplete="off" id="search-bar" onKeyDown={(e) => onSearch(e)} onChange={(e) => setSearchText(e.target.value)} type="text" placeholder="Search"/>
                <button onClick={clearSearch} className="clear-btn">
                    <FontAwesomeIcon icon={faXmark}/>
                </button>
                <button onClick={() => {
                        setMovie(searchText)
                        setVisible(true)
                    }}
                >
                    Search
                </button>
            </div>

            {visible && !isGame && <Suggestions movie={movie} type={type}/>}
        </>
    )
}