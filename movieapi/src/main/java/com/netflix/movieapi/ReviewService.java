package com.netflix.movieapi;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {
    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);
    
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private MongoTemplate mongoTemplate; // to talk to database

    public Review CreateReview(String reviewBody, String imdbId, String username) {
        logger.info("Creating review for movie: {} by user: {}", imdbId, username);
        
        // Create and save the review first to get its ID
        Review review = new Review(reviewBody, username);
        Review savedReview = reviewRepository.insert(review);
        logger.info("Created review with ID: {}", savedReview.getId());
        
        // Update the movie with the review's ObjectId
        mongoTemplate.update(Movie.class)
                .matching(Criteria.where("imdbId").is(imdbId))
                .apply(new Update().push("reviewIds").value(savedReview.getId()))
                .first();
        logger.info("Added review ID to movie: {}", imdbId);
        
        return savedReview;
    }

    public void deleteReview(String reviewId, String imdbId) {
        logger.info("Starting delete process for review ID: {} from movie: {}", reviewId, imdbId);
        
        try {
            // Convert String ID to ObjectId
            ObjectId objectId = new ObjectId(reviewId);
            logger.info("Converted review ID to ObjectId: {}", objectId);
            
            // Delete the review from the reviews collection
            reviewRepository.deleteById(objectId);
            logger.info("Deleted review from reviews collection");
            
            // Remove the review ID from the movie's reviewIds array
            mongoTemplate.update(Movie.class)
                    .matching(Criteria.where("imdbId").is(imdbId))
                    .apply(new Update().pull("reviewIds", objectId))
                    .first();
            logger.info("Removed review ID from movie's reviewIds array");
        } catch (Exception e) {
            logger.error("Error in deleteReview: {}", e.getMessage(), e);
            throw e;
        }
    }
}
