// import css from "./App.module.css";

import axios from "axios";
import SearchBar from "../SearchBar/SearchBar";
import { useEffect, useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import type { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

interface DataHttpResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function handleSearch(searchWord: string) {
    try {
      const options = {
        params: {
          query: searchWord,
        },
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
      };
      setIsError(false);
      setIsLoading(true);

      const resp = await axios.get<DataHttpResponse>(
        "https://api.themoviedb.org/3/search/movie",
        options
      );
      console.log(resp.data.results);

      setMovies(resp.data.results);

      if (resp.data.results.length === 0) {
        alert("No movies found for your request");
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectFilm() {
    console.log("ok");
  }

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isLoading ? (
        <Loader />
      ) : (
        movies.length && (
          <MovieGrid onSelect={handleSelectFilm} movies={movies} />
        )
      )}
      {/* {isError ? (
        <ErrorMessage />
      ) : (
        movies.length && (
          <MovieGrid onSelect={handleSelectFilm} movies={movies} />
        )
      )} */}
    </>
  );
}
