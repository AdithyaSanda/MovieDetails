import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

export default function SkeletonHolder({count = 7}) {
    return(
        <>
            {Array(count).fill(0).map((_, index) => (
                <div key={index}>
                    <div className="popular-movie-poster"><Skeleton baseColor="#313131" highlightColor="#525252" height='225px' width='150px'/></div>
                    <div className="popular-movie-title"><Skeleton baseColor="#313131" highlightColor="#525252" height='20px' width='150px'/></div>
                </div>
            ))}
        </>
    )
}