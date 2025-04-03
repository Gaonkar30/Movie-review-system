package com.netflix.movieapi;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private MongoTemplate mongoTemplate; // to talk to database

    public Review CreateReview(String reviewBody, String imdbId, String username) {
        Review review = reviewRepository.insert(new Review(reviewBody, username));
        mongoTemplate.update(Movie.class)
                .matching(Criteria.where("imdbId").is(imdbId))
                .apply(new Update().push("reviewIds").value(review.getId()))
                .first();
        return review;
    }

    public List<Review> getReviewsByMovieId(String imdbId) {
        Movie movie = mongoTemplate.findOne(
                Query.query(Criteria.where("imdbId").is(imdbId)),
                Movie.class
        );

        if (movie != null && movie.getReviewIds() != null && !movie.getReviewIds().isEmpty()) {
            // Extract the IDs from the Review objects
            List<ObjectId> reviewObjectIds = movie.getReviewIds().stream()
                    .map(Review::getId)
                    .toList();

            // Now use the extracted IDs to fetch the reviews
            return reviewRepository.findAllById(reviewObjectIds);
        }
        return List.of();
    }

    public boolean isReviewOwner(String reviewId, String username) {
        try {
            ObjectId reviewObjectId = new ObjectId(reviewId);
            Optional<Review> review = reviewRepository.findById(reviewObjectId);
            return review.map(r -> r.getUsername().equals(username)).orElse(false);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    public void deleteReview(String reviewId) {
        try {
            ObjectId reviewObjectId = new ObjectId(reviewId);
            
            // Remove the review reference from the movie
            mongoTemplate.updateMulti(
                Query.query(Criteria.where("reviewIds").is(reviewObjectId)),
                new Update().pull("reviewIds", reviewObjectId),
                Movie.class
            );

            // Delete the review
            reviewRepository.deleteById(reviewObjectId);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid review ID format");
        }
    }
}
