import {useEffect, useRef} from 'react';
import api from '../../api/axiosConfig';
import {useParams} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import ReviewForm from '../reviewForm/ReviewForm';
import {useAuth} from '../../context/AuthContext';
import './Reviews.css';

import React from 'react'

const Reviews = ({getMovieData,movie,reviews,setReviews}) => {

    const revText = useRef();
    const params = useParams();
    const movieId = params.movieId;
    const {user} = useAuth();

    useEffect(() => {
        console.log('Fetching movie data for ID:', movieId);
        getMovieData(movieId);
    }, []);

    useEffect(() => {
        console.log('Current reviews:', reviews);
    }, [reviews]);

    const addReview = async (e) => {
        e.preventDefault();
        const rev = revText.current;
    
        try {
            console.log('Sending review:', { reviewBody: rev.value, imdbId: movieId });
            const response = await api.post("/api/v1/reviews", {
                reviewBody: rev.value,
                imdbId: movieId
            });
            console.log('Review created:', response.data);
    
            const updatedReviews = [...reviews, response.data];
            rev.value = "";
            setReviews(updatedReviews);
        } catch (err) {
            console.error('Error creating review:', err);
        }
    };
    
    const handleDeleteReview = async (reviewId) => {
        console.log('Attempting to delete review:', reviewId);
        try {
            // Convert the review ID to string if it's an object
            const reviewIdString = typeof reviewId === 'object' ? reviewId.$oid || reviewId.toString() : reviewId;
            await api.delete(`/api/v1/reviews/${reviewIdString}?imdbId=${movieId}`);
            console.log('Review deleted successfully');
            
            // After successful deletion, fetch fresh data
            getMovieData(movieId);
        } catch (err) {
            console.error('Error deleting review:', err);
        }
    };

  return (
    <Container>
        <Row>
            <Col><h3>Reviews</h3></Col>
        </Row>
        <Row className="mt-2">
            <Col>
                <img src={movie?.poster} alt={movie?.title} />
            </Col>
            <Col>
                {
                    <>
                        <Row>
                            <Col>
                                <ReviewForm handleSubmit={addReview} revText={revText} labelText = "Write a Review?" />  
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <hr />
                            </Col>
                        </Row>
                    </>
                }
                {
                    reviews && reviews.length > 0 ? (
                        reviews.map((r) => {
                            console.log('Rendering review:', r);
                            return(
                                <div key={r.id} className="review-container">
                                    <div className="review-header">
                                        <div className="review-user-info">
                                            <span className="review-username">{r.username || 'Anonymous'}</span>
                                        </div>
                                        {user && user.username === r.username && (
                                            <button className="delete-review" onClick={() => handleDeleteReview(r.idString || r.id)}>
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                    <div className="review-body">{r.body}</div>
                                    <hr />
                                </div>
                            )
                        })
                    ) : (
                        <div className="no-reviews">No reviews yet. Be the first to review this movie!</div>
                    )
                }
            </Col>
        </Row>
        <Row>
            <Col>
                <hr />
            </Col>
        </Row>        
    </Container>
  )
}

export default Reviews