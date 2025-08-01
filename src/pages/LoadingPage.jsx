import {ClipLoader} from 'react-spinners'
export default function LoadingPage() {
    return(
        <div className='loading-component'>
            <ClipLoader color='#fca311' size={50}/>
        </div>
    )
}