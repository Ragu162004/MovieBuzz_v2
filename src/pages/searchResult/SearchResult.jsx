import React, { useState, useEffect } from 'react';
import "./style.scss";
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchDataFromApi } from './../../utils/api';
import ContentWrapper from './../../components/contentWrapper/ContentWrapper';
import noResults from "../../assets/no-results.png";
import Spinner from '../../components/spinner/Spinner';
import MovieCard from '../../components/movieCard/MovieCard';


const genreMap = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

const SearchResult = () => {
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]); // New state for storing genres
  const { query } = useParams();

  const extractGenres = (results) => {
    const genres = results
      .filter(item => item.media_type === 'movie' && item.genre_ids)
      .flatMap(item => item.genre_ids); // Collect all genre ids
    return [...new Set(genres)]; // Remove duplicates
  };


  const getGenreNames = (genreIds) => {
    return genreIds.map(id => genreMap[id] || 'Unknown'); // Map genre IDs to names
  };

  const fetchInitialData = () => {
    setLoading(true);
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then((res) => {
      setData(res);
      setPageNum((prev) => prev + 1);

      const newGenres = extractGenres(res.results);
      const genreNames = getGenreNames(newGenres);
      console.log('Genres:', genreNames);
      setGenres(newGenres);
      console.log(newGenres);
      localStorage.setItem('movieGenres', JSON.stringify(newGenres));
      localStorage.setItem('genreNames', JSON.stringify(genreNames));
      setLoading(false);
    });
  };

  const fetchNextPageData = () => {
    setLoading(true);
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then((res) => {
      if (data?.results) {
        setData({
          ...data,
          results: [...data.results, ...res.results]
        });
      } else {
        setData(res);
      }

      // Update genres state and save to localStorage
      const newGenres = extractGenres(res.results);
      const updatedGenres = [...new Set([...genres, ...newGenres])];
      setGenres(updatedGenres);
      console.log(updatedGenres);
      localStorage.setItem('movieGenres', JSON.stringify(updatedGenres));

      setPageNum((prev) => prev + 1);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchInitialData();
  }, [query]);

  return (
    <div className='searchResultsPage'>
      {loading && <Spinner initial={true} />}
      {!loading && (
        <ContentWrapper>
          {data?.results?.length > 0 ? (
            <>
              <div className="pageTitle">{`Search ${data?.total_results > 1 ? "results" : "result"} of '${query}'`}</div>
              <InfiniteScroll
                className='content'
                dataLength={data?.results?.length || []}
                next={fetchNextPageData}
                hasMore={pageNum <= data?.total_pages}
                loader={<Spinner />}
              >
                {data?.results.map((item, index) => {
                  if (item.media_type === 'person') return;
                  return (
                    <MovieCard
                      key={index}
                      data={item}
                      fromSearch={true}
                    />
                  );
                })}
              </InfiniteScroll>
            </>
          ) : (
            <span className="resultNotFound">Sorry, Results not found</span>
          )}
        </ContentWrapper>
      )}
    </div>
  );
};

export default SearchResult;