package com.netflix.movieapi;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {
    @Autowired
    private MovieService movieService;
    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping
    public ResponseEntity<List<Movie>> getMovies(){
        return new ResponseEntity<List<Movie>>(movieService.findAllMovies(),HttpStatus.OK);
    }
    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/{imdbid}")
    public ResponseEntity<Optional<Movie>> getSingleMovie(@PathVariable String imdbid){
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(imdbid),HttpStatus.OK);
    }
    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping
    public ResponseEntity<Movie> createMovie(@RequestBody Movie movie) {
        return new ResponseEntity<Movie>(movieService.createMovie(movie), HttpStatus.CREATED);
    }
    @CrossOrigin(origins = "http://localhost:5173")
    @DeleteMapping("/{imdbid}")
    public ResponseEntity<Void> deleteMovie(@PathVariable String imdbid) {
        movieService.deleteMovie(imdbid);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
