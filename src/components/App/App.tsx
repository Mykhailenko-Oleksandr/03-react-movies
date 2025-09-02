import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import type { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";

const notify = () => toast.error("No movies found for your request");

let movieSelected: Movie;

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = (movie: Movie) => {
    movieSelected = movie;
    console.log(movie);

    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  async function handleSearch(searchWord: string) {
    try {
      setIsError(false);
      setIsLoading(true);

      const res = await fetchMovies(searchWord);
      setMovies(res);

      if (res.length === 0) {
        notify();
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  // const [content, setContent] = useState(null)
  // let content: JSX.Element | undefined;
  // if (isLoading) {
  //   content = <Loader />;
  // } else if (isError) {
  //   content = <ErrorMessage />;
  // } else if (movies.length > 0) {
  //   content = <MovieGrid onSelect={openModal} movies={movies} />;
  // }

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
      {/* {content} */}
      {isModalOpen && <MovieModal movie={movieSelected} onClose={closeModal} />}
      <Toaster />;
    </>
  );
}
