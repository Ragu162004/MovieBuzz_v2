import React, { useState, useEffect } from 'react';
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper';
import SwitchTabs from '../../../components/switchTabs/SwitchTabs';
import useFetch from './../../../hooks/useFetch';
import Carousel from '../../../components/carousel/Carousel';

const GenreMovies = () => {
    // Create states
    const [endpoint, setEndpoint] = useState("movie");
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null); // To track the selected genre

    // Fetch genres from localStorage when component mounts
    useEffect(() => {
        const storedGenres = JSON.parse(localStorage.getItem('movieGenres'));
        if (storedGenres) {
            setGenres(storedGenres); // Store genres in state
            setSelectedGenre(storedGenres[0]); // Set default selected genre
        }
    }, []);

    const { data: genreMovies, loading: genreLoading } = useFetch(
        selectedGenre
            ? `/discover/movie?with_genres=${selectedGenre}&api_key=YOUR_API_KEY`
            : `/movie/top_rated?api_key=YOUR_API_KEY`
    );


    const onTabChange = (tab) => {
        setEndpoint(tab === "Movies" ? "movie" : "tv");
    };

    return (
        <div className='carouselSection'>
            <ContentWrapper>
                <span className="carouselTitle">Based on Your Recent Search</span>
            </ContentWrapper>
            <Carousel data={genreMovies?.results} loading={genreLoading} endpoint={endpoint} />
        </div>
    );
};

export default GenreMovies;
