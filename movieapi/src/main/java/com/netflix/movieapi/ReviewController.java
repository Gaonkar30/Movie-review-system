package com.netflix.movieapi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/reviews") // reviews are present in the movie page itself no need a seperate page for it
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {
    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);
    
    @Autowired
    private ReviewService reviewService;

    @PostMapping()
    public ResponseEntity<Review> createReview(@RequestBody Map<String, String> payload) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        logger.info("Creating review for user: {}", username);
        return new ResponseEntity<Review>(
            reviewService.CreateReview(
                payload.get("reviewBody"),
                payload.get("imdbId"),
                username
            ),
            HttpStatus.CREATED
        );
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable String reviewId, @RequestParam String imdbId) {
        logger.info("Attempting to delete review with ID: {} for movie: {}", reviewId, imdbId);
        try {
            reviewService.deleteReview(reviewId, imdbId);
            logger.info("Successfully deleted review with ID: {}", reviewId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            logger.error("Error deleting review with ID: {}: {}", reviewId, e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
