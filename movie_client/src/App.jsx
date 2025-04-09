import './App.css';
import api from './api/axiosConfig';
import {useState, useEffect} from 'react';
import Layout from './components/Layout';
import {Routes, Route, Navigate} from 'react-router-dom';
import Home from './components/home/Home';
import Header from './components/header/Header';
import Trailer from './components/trailer/Trailer';
import Reviews from './components/reviews/Reviews';
import AddMovie from './components/admin/AddMovie';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import {AuthProvider, useAuth} from './context/AuthContext';

// Protected Route component
const ProtectedRoute = ({children, adminOnly = false}) => {
  const {user, isAdmin} = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  const [movies, setMovies] = useState();
  const [movie, setMovie] = useState();
  const [reviews, setReviews] = useState([]);

  const getMovies = async () => {
    try {
      console.log('Fetching all movies');
      const response = await api.get("/api/v1/movies");
      console.log('Movies fetched:', response.data);
      setMovies(response.data);
    } catch(err) {
      console.error('Error fetching movies:', err);
    }
  }

  const getMovieData = async (movieId) => {
    try {
      console.log('Fetching movie data for ID:', movieId);
      const movieResponse = await api.get(`/api/v1/movies/${movieId}`);
      const singleMovie = movieResponse.data;
      console.log('Movie data fetched:', singleMovie);
      setMovie(singleMovie);
      
      // Fetch reviews separately
      console.log('Fetching reviews for movie:', movieId);
      const reviewsResponse = await api.get(`/api/v1/movies/${movieId}/reviews`);
      console.log('Reviews fetched:', reviewsResponse.data);
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  }

  const deleteMovie = async (imdbId) => {
    try {
      console.log('Deleting movie:', imdbId);
      await api.delete(`/api/v1/movies/${imdbId}`);
      console.log('Movie deleted successfully');
      getMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  }

  useEffect(() => {
    getMovies();
  },[])

  return (
    <AuthProvider>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route path="/" element={<Home movies={movies} onDeleteMovie={deleteMovie} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/add-movie" 
              element={
                <ProtectedRoute adminOnly>
                  <AddMovie />
                </ProtectedRoute>
              } 
            />
            <Route path="/Trailer/:ytTrailerId" element={<Trailer/>}/>
            <Route 
              path="/Reviews/:movieId" 
              element={
                <ProtectedRoute>
                  <Reviews getMovieData={getMovieData} movie={movie} reviews={reviews || []} setReviews={setReviews} />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;