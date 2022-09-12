import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getMovies, getTv } from "../api";
import { makeImagePath } from "../util";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number; 
  total_results: number;
}

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 200px;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{bgPoster:string}>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${props => props.bgPoster});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 25px;
  width: 50%;
`;
const Slider = styled.div`
  position: relative;
  top: -100px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)<{bgphoto:string}>`
  background-color: white;
  background-image: url(${props => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  };
  &:last-child {
    transform-origin: center right;
  };
`;
const BoxInfo = styled(motion.div)`
  padding: 20px;
  width: 100%;
  background-color: ${props => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const BigMovie = styled(motion.div)`
   position: absolute;
   width: 40vw;
   height: 80vh;
   left:0;
   right:0;
   margin: 0 auto;
   border-radius: 15px;
   overflow: hidden;
   background-color: ${props => props.theme.black.lighter};
`;
const BigCover = styled.img`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 500px;
`;
const BigTitle = styled.h2`
  color: ${props => props.theme.white.lighter};
  padding: 20px;
  text-align: center;
  font-size: 36px;
`;
const BigOverview = styled.h2`
  color: ${props => props.theme.white.lighter};
  padding: 20px;
  text-align: center;
  font-size: 20px;
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0
  },
  exit: {
    x: -window.outerWidth - 5
  },
};
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.2,
      duration: 0.3,
      type:"tween",
    }
  },
  exit: {
  }
};
const boxInfoVariants ={
  hover: {
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 0.3,
      type:"tween",
    },
  }
};

const BannerMovieNum = 0;
const slideOffset = 6;   

function Home() {

  const {data, isLoading} = useQuery<IGetMoviesResult>(["movie", "nowPlaying"], getMovies);
  const [idx, setIdx] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{movieId:string}>("/movies/:movieId");
  const {scrollY} = useScroll();
  const toggleLeaving = () => setLeaving(prev => !prev);
  const increaseIndex = () => {
    if(data) {
      if(leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxPage = Math.floor(totalMovies / slideOffset) - 1;
      setIdx((prev) => (prev === maxPage ? 0 : prev+1));  
    }
  }
  const onBoxClicked = (movieId:number) => {
    history.push(`/movies/${movieId}`);
  }
  const onClickOverlay = () => {
    history.push(`/`);
  }
  const clickedMovie = bigMovieMatch?.params.movieId && 
              data?.results.find( movie => movie.id+"" === bigMovieMatch.params.movieId)

  return (
    <Wrapper>
      {isLoading ? <Loader>Loading...</Loader> : (
        <>
          <Banner onClick={increaseIndex} 
                  bgPoster={makeImagePath(data?.results[BannerMovieNum].backdrop_path || "")}>
            <Title>{data?.results[BannerMovieNum].title}</Title>
            <Overview>{data?.results[BannerMovieNum].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row 
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{type:"tween", duration: 1}}
                key={idx}>
                {data?.results
                  .slice(1)
                  .slice(slideOffset*idx, slideOffset*idx+slideOffset)
                  .map((movie) => (
                    <Box 
                      layoutId={movie.id+""}
                      key={movie.id}
                      onClick={() => onBoxClicked(movie.id)}
                      whileHover="hover"
                      initial="normal"
                      exit="exit"
                      transition={{type:"tween"}}
                      variants={boxVariants}
                      bgphoto={makeImagePath(movie.poster_path || "", "w500")} 
                    >
                      <BoxInfo 
                        variants={boxInfoVariants}
                      >
                        <h4>{movie.title}</h4>
                      </BoxInfo>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ?
            <>
              <Overlay onClick={onClickOverlay} animate={{opacity:1}} exit={{opacity:0}}></Overlay>
              <BigMovie 
                layoutId={bigMovieMatch.params.movieId}
                style={{ top:scrollY.get()+100 }}
              >
                {clickedMovie && <>
                  <BigCover style={{backgroundImage:`url( ${makeImagePath(clickedMovie.backdrop_path || "", "w500")} )`}} ></BigCover>
                  <BigTitle>{clickedMovie.title}</BigTitle>
                  <BigOverview>{clickedMovie.overview}</BigOverview>
                </>}
              </BigMovie> 
            </>
            : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;