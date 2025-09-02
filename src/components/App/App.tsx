import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import type { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

interface DataHttpResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface OptionAPI {
  params: {
    query: string;
  };
  headers: {
    Authorization: string;
  };
}

const url: string = "https://api.themoviedb.org/3/search/movie";
const notify = () => toast.error("No movies found for your request");

let movieSelected: Movie;

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (movie: Movie) => {
    movieSelected = movie;
    console.log(movie);

    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  async function handleSearch(searchWord: string) {
    try {
      const options: OptionAPI = {
        params: {
          query: searchWord,
        },
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
      };

      setIsError(false);
      setIsLoading(true);

      const resp = await axios.get<DataHttpResponse>(url, options);

      setMovies(resp.data.results);

      if (resp.data.results.length === 0) {
        notify();
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage />
      ) : (
        movies.length > 0 && <MovieGrid onSelect={openModal} movies={movies} />
      )}
      {isModalOpen && <MovieModal movie={movieSelected} onClose={closeModal} />}
      <Toaster />;
    </>
  );
}
