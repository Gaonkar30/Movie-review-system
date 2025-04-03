import {useEffect, useRef, useState} from 'react';
import api from '../../api/axiosConfig';
import {useParams} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import ReviewForm from '../reviewForm/ReviewForm';
import {useAuth} from '../../context/AuthContext';
import './Reviews.css';

import React from 'react'

const Reviews = ({getMovieData,movie,setReviews}) => {

    const revText = useRef();
    const params = useParams();
    const movieId = params.movieId;
    const {user} = useAuth();
    const [reviews, setLocalReviews] = useState([]);

    useEffect(()=>{
        getMovieData(movieId);
        fetchReviews();
    },[movieId])

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/api/v1/reviews/movie/${movieId}`);
            setLocalReviews(response.data);
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const addReview = async (e) => {
        e.preventDefault();
        const rev = revText.current;
    
        try {
            // Send the review data to the API
            const response = await api.post("/api/v1/reviews", {
                reviewBody: rev.value,
                imdbId: movieId
            });
    
            // Extract the newly created review from the API response
            const updatedReviews = [...reviews, response.data];
    
            // Clear the input field
            rev.value = "";
    
            // Update the state
            setLocalReviews(updatedReviews);
            setReviews(updatedReviews);
        } catch (err) {
            console.error(err);
        }
    };
    
    const handleDeleteReview = async (reviewId) => {
        try {
            // Convert ObjectId to string if it's an object
            const id = reviewId.toString();
            await api.delete(`/api/v1/reviews/${id}`);
            const updatedReviews = reviews.filter(r => r.id !== reviewId);
            setLocalReviews(updatedReviews);
            setReviews(updatedReviews);
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
                            return(
                                <div key={r.id} className="review-container">
                                    <div className="review-header">
                                        <span className="review-username">{r.username}</span>
                                        {user && user.username === r.username && (
                                            <button className="delete-review" onClick={() => handleDeleteReview(r.id)}>
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
                        <div className="no-reviews">No reviews yet. Be the first to review!</div>
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