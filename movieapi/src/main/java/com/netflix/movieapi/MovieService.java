package com.netflix.movieapi;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {
    private static final Logger logger = LoggerFactory.getLogger(MovieService.class);

    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Movie> findAllMovies() {
        return movieRepository.findAll();
    }

    public Optional<Movie> singleMovie(String imdbId) {
        return movieRepository.findMovieByImdbId(imdbId);
    }

    public Movie createMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    @Transactional
    public void deleteMovie(String imdbId) {
        logger.info("Attempting to delete movie with imdbId: {}", imdbId);
        try {
            // First, find the movie to get its reviews
            Optional<Movie> movieOpt = movieRepository.findMovieByImdbId(imdbId);
            if (movieOpt.isPresent()) {
                Movie movie = movieOpt.get();
                // Delete associated reviews if they exist
                if (movie.getReviewIds() != null && !movie.getReviewIds().isEmpty()) {
                    logger.info("Deleting {} reviews for movie {}", movie.getReviewIds().size(), imdbId);
                    movie.getReviewIds().forEach(reviewId -> {
                        try {
                            reviewRepository.deleteById(reviewId);
                        } catch (Exception e) {
                            logger.error("Error deleting review {}: {}", reviewId, e.getMessage());
                        }
                    });
                }
            }
            
            // Delete the movie
            movieRepository.deleteByImdbId(imdbId);
            logger.info("Successfully deleted movie with imdbId: {}", imdbId);
        } catch (Exception e) {
            logger.error("Error deleting movie with imdbId {}: {}", imdbId, e.getMessage());
            throw e;
        }
    }

    public List<Review> getReviewsForMovie(String imdbId) {
        Optional<Movie> movieOpt = movieRepository.findMovieByImdbId(imdbId);
        if (movieOpt.isPresent()) {
            Movie movie = movieOpt.get();
            if (movie.getReviewIds() != null && !movie.getReviewIds().isEmpty()) {
                Query query = new Query(Criteria.where("_id").in(movie.getReviewIds()));
                return mongoTemplate.find(query, Review.class);
            }
        }
        return List.of();
    }
}
