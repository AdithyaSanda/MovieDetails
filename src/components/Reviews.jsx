import { useEffect, useState } from "react";
import ShowMoreText from 'react-show-more-text'
import { useLocation } from "react-router-dom"
import supabase from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { useMemo } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


export default function Reviews({id}) {

    const [reviews, setReviews] = useState([])
    const [userReview, setUserReview] = useState('')
    const [receivedReviews, setReceivedReviews] = useState([])
    const [rating, setRating] = useState()
    const [userId, setUserId] = useState()
    const [userName, setUserName] = useState()

    const location = useLocation()
    const type = location.pathname.slice(1, 6)

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: import.meta.env.VITE_TMDB_API
        }
    };


    useEffect(() => {
        
        fetch(`https://api.themoviedb.org/3/${type === 'movie' ? 'movie' : 'tv'}/${id}/reviews?language=en-US&page=1`, options)
            .then(res => res.json())
            .then(data => {
                setReviews(data.results)
                
            })
            .catch(err => console.error(err));
        

        
        
    }, [id])

    
    const {getUserId, session} = useAuth()

    useEffect(() => {
        async function fetchUserid() {
            const userid = await getUserId()
            setUserId(userid)
        }

        fetchUserid()
        getUserName()
    }, [])

    
    async function handleAddReview() {

        const userid = await getUserId()
        if(!userid) {
            console.error('user id not found')
            return
        }
        
        try {
            const {error} = await supabase
            .from('reviews')
            .insert([
                {user_id: userid, movie_id: id, review: userReview, rating: rating, name:userName}
            ])

            if(error) {
                console.error(error)
            }
            else {
                setUserReview("")
                setRating("")
            }
        }
        catch(error) {
            console.error(error)
            return
        }
    }   
    
    const getUserName = async () => {

        const userid = await getUserId()
        if(!userid) {
            console.error('user id not found')
            return
        }

        try {
            const {data, error} = await supabase
            .from('profiles')
            .select('name')
            .eq('id', userid)

            if(error) {
                console.error(error)
                return
            }
            setUserName(data[0].name)
        }
        catch(error) {
            console.error(error)
        }
    }


    useEffect(() => {
        async function getReviews() {
            try {
                const {data, error} = await supabase
                .from('reviews')
                .select('review, rating, movie_id, user_id, name, id')
                .eq('movie_id', id)

                if(error) {
                    console.error(error)
                    return
                }
                
                
                setReceivedReviews(data)
            }
            catch(error) {
                console.error(error)
                return
            }
        }

        getReviews()



        const channel = supabase
            .channel('reviews-changes')
            .on(
                'postgres_changes',
                {
                event: '*',
                schema: 'public',
                table: 'reviews',
                },
                (payload) => {
                setReceivedReviews((prev) => [...prev, payload.new]);
                }
            )
            .subscribe();


            return () => {
            supabase.removeChannel(channel);
            };
       
            

    }, [id])




    async function handleDeleteReview(reviewId) {

        try {

            const {error} = await supabase
            .from('reviews')
            .delete()
            .eq('id', reviewId)

            if(error) {
                console.error(error)
                return
            }
            else {
                setReceivedReviews(prev => prev.filter(r => r.id !== reviewId))
            }
        }
        catch(error) {
            console.error(error)
        }
    }

    const reversedReviews = useMemo(() => {
        return receivedReviews.filter(r => r.movie_id === id)
        .slice()
        .reverse()
    }, [receivedReviews])

    

    return(
        <div className="reviews-container">
            <span className="cast-heading review-heading">Reviews <span className="review-count">{receivedReviews.length + reviews.length}</span></span>
            {session && <p className="add-review-heading">Add a review</p>}
            {session && <form className="review-form" onSubmit={(e) => {
                e.preventDefault()
                handleAddReview()
            }}>
                
                <input className="review-input" type="text" placeholder="Enter review" value={userReview} onChange={(e) => setUserReview(e.target.value)}/>
                <div>
                    <select className="review-rating-input" value={rating} onChange={(e) => {
                        e.preventDefault()
                        setRating(e.target.value)
                    }}>
                        <option value="">Select Rating</option>
                        {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                            <option className="rating-option" key={n} value={n}>
                                {n} Star{n > 1 && "s"}
                            </option>
                        ))}
                    </select>
                    <button className="review-sumbit-btn" type="submit" >Add</button>
                </div>
                
            </form>}
           
            <div className="review-box">
                {reversedReviews.map(reviews => (
                    <div className="review-holder" key={reviews.id}>
                        <div className="reviewer-details">
                            <img className="reviewer-pic" src={`https://placehold.co/160x160?text=${reviews.name.slice(0,1)}`}/>
                            <span className="cast-heading reviewer">{reviews.name}</span>
                            {reviews.user_id === userId && <button className="delete-review-btn" onClick={() => handleDeleteReview(reviews.id)}>
                                    <FontAwesomeIcon  icon={faTrash}/>
                                </button>}
                        </div>
                        <span className="rating-review"><span className="rating">Rating:</span> {reviews.rating}/10</span>
                        <ShowMoreText
                            lines={4}
                            className="review"
                            anchorClass="review-link"
                        >
                            {reviews.review}
                        </ShowMoreText>
                    </div>
                ))}
                {reviews.map(review => (
                    <div className="review-holder" key={review.id}>
                        <div className="reviewer-details">
                            <img className="reviewer-pic" src={review.author_details.avatar_path ? `https://image.tmdb.org/t/p/w185${review.author_details.avatar_path}`: `https://placehold.co/160x160?text=${review.author.slice(0,1)}`}/>
                            <span className="cast-heading reviewer">{review.author}</span>
                        </div>
                        {review.author_details.rating ? <span className="rating-review"><span className="rating">Rating:</span> {review.author_details.rating}/10</span> : <span className="rating-review">Rating: N/A</span>}


                        
                        <ShowMoreText
                            lines={4}
                            className="review"
                            anchorClass="review-link"
                        >
                            {review.content}
                        </ShowMoreText>


                        
                        
                    </div>
                ))}
            </div>
        </div>
    )
    
}