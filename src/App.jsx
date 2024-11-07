import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchDataFromApi } from "./utils/api";
import { getApiConfiguration, getGenres } from './store/homeSlice';

import Layout from './Layout'; // Import the new Layout component
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import SearchResult from './pages/searchResult/SearchResult';
import Explore from './pages/explore/Explore';
import PageNotFound from './pages/404/PageNotFound';
import AuthPage from './pages/login_and_SignUp/Auth';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check session expiration
    const sessionExpiration = localStorage.getItem('sessionExpiration');
    const currentTime = Date.now();

    if (sessionExpiration && currentTime > sessionExpiration) {
      // Session has expired
      localStorage.removeItem('user');
      localStorage.removeItem('sessionExpiration');
      navigate('/auth'); // Redirect to login page
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchApiConfig();
        await genresCall();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchApiConfig = async () => {
    try {
      const res = await fetchDataFromApi('/configuration');
      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };
      dispatch(getApiConfiguration(url));
    } catch (error) {
      console.error('Error fetching API configuration:', error);
    }
  };

  const genresCall = async () => {
    try {
      let promises = [];
      let endPoints = ["tv", "movie"];
      let allGenres = {};

      endPoints.forEach((url) => {
        promises.push(fetchDataFromApi(`/genre/${url}/list`));
      });

      const data = await Promise.all(promises);
      data.map(({ genres }) => {
        return genres.map((item) => (allGenres[item.id] = item));
      });

      dispatch(getGenres(allGenres));
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  
  const channel = new BroadcastChannel('session-channel'); // Initialize BroadcastChannel

  useEffect(() => {
    const checkSession = () => {
      const sessionExpiration = localStorage.getItem('sessionExpiration');
      const currentTime = Date.now();

      if (sessionExpiration && currentTime > sessionExpiration) {
        // If session is expired, clear localStorage and notify all tabs
        localStorage.removeItem('user');
        localStorage.removeItem('sessionExpiration');
        channel.postMessage({ type: 'SESSION_EXPIRED' }); // Broadcast session expiration
        navigate('/auth');
      }
    };

    // Check session on initial load
    checkSession();

    // Set up interval to check session every minute
    const intervalId = setInterval(checkSession, 60 * 1000);

    // Listen for session expiration from other tabs
    channel.onmessage = (event) => {
      if (event.data.type === 'SESSION_EXPIRED') {
        // If another tab reports session expiration, navigate to login
        navigate('/auth');
      }
    };

    // Cleanup interval and BroadcastChannel on component unmount
    return () => {
      clearInterval(intervalId);
      channel.close();
    };
  }, [navigate]);


  return (
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/:mediaType/:id' element={<Details />} />
          <Route path='/search/:query' element={<SearchResult />} />
          <Route path='/explore/:mediaType' element={<Explore />} />
          <Route path='*' element={<PageNotFound />} />
        </Route>
        <Route path='/auth' element={<AuthPage />} />
      </Routes>
  );
}

export default App;


