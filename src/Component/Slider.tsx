import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getMovies } from "../api";
import { makeImagePath } from "../util";
import { IGetMoviesResult } from "./atoms";

const Wrapper = styled.div`
  top: -100px;
`;
const SlideBox = styled.div`
  position: relative;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
`;
const ArrowDivRight = styled.div`
  fill: #cfc4c4;
  position: absolute;
  right: 0px;
  bottom: -90px;
  &:hover {
    fill: white;
  }
  height: 200px;
  width: 50px;
`;
const ArrowDivLeft = styled.div`
  fill: #cfc4c4;
  position: absolute;
  left: 10px;
  bottom: -90px;
  &:hover {
    fill: white;
  }
  height: 200px;
  width: 50px;
`;

const SvgArrowRight = styled.svg`
`;
const SvgArrowLeft = styled.svg`
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
   z-index: 99;
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
  hidden: (isBack:boolean) => ({
    x: isBack ? -window.outerWidth - 5 : window.outerWidth + 5,
  }),
  visible: {
    x: 0
  },
  exit: (isBack:boolean) => ({
    x: isBack ? window.outerWidth + 5 : -window.outerWidth - 5
  }),
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

const slideOffset = 6;
interface SlideProps {
  slideId:string,
}


function Slider({slideId}:SlideProps) {

  const {data, isLoading} = useQuery<IGetMoviesResult>([`movie+${slideId}`, `nowPlaying+${slideId}`], getMovies);
  const [leaving, setLeaving] = useState(false);
  const [clkslideId, setclkslideId] = useState('');
  const [backBtn, setbackBtn] = useState(false);
  const [idx, setIdx] = useState(0);
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{movieId:string, slideId:string}>("/movies/:movieId");
  const {scrollY} = useScroll();

  const toggleLeaving = () => setLeaving(prev => !prev);
  const decreaseIndex = () => {
    if(data) {
      if(leaving) return;
      toggleLeaving();
      setbackBtn(true);
      const totalMovies = data?.results.length - 1;
      const maxPage = Math.floor(totalMovies / slideOffset) - 1;
      setIdx((prev) => (prev === maxPage ? 0 : prev+1));  
    }
  }
  const increaseIndex = () => {
    if(data) {
      if(leaving) return;
      toggleLeaving();
      setbackBtn(false);
      const totalMovies = data?.results.length - 1;
      const maxPage = Math.floor(totalMovies / slideOffset) - 1;
      setIdx((prev) => (prev === 0 ? maxPage : prev-1));  
    }
  }

  const onBoxClicked = (movieId:number, sid:string) => {
    setclkslideId(sid);
    history.push(`/movies/${movieId}`);
  }
  const onClickOverlay = (sid:string) => {
    setclkslideId('');
    history.push(`/`);
  }
  const clickedMovie = bigMovieMatch?.params.movieId && 
              data?.results.find( movie => movie.id+"" === bigMovieMatch.params.movieId)

  return (
    <Wrapper>
      <SlideBox>
        <ArrowDivRight>
          <SvgArrowRight
            onClick={decreaseIndex}
            xmlns="http://www.w3.org/2000/svg"><path d="m15.2 43.9-2.8-2.85L29.55 23.9 12.4 6.75l2.8-2.85 20 20Z"/>
          </SvgArrowRight>
        </ArrowDivRight>
        <ArrowDivLeft>
          <SvgArrowLeft
            onClick={increaseIndex}
            xmlns="http://www.w3.org/2000/svg"><path d="M20 44 0 24 20 4l2.8 2.85L5.65 24 22.8 41.15Z"/>
          </SvgArrowLeft>
        </ArrowDivLeft>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving} custom={backBtn}>
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{type:"tween", duration: 1}}
            key={idx}
          >
            {data?.results
              .slice(1)
              .slice(slideOffset*idx, slideOffset*idx+slideOffset)
              .map((movie) => (
                <Box
                  layoutId={movie.id+slideId}
                  key={movie.id+slideId}
                  onClick={() => onBoxClicked(movie.id, slideId)}
                  whileHover="hover"
                  initial="normal"
                  exit="exit"
                  transition={{type:"tween"}}
                  variants={boxVariants}
                  bgphoto={makeImagePath(movie.backdrop_path || "", "w500")}
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
      </SlideBox>
      <AnimatePresence>
        {bigMovieMatch && clkslideId ?
        <>
          <Overlay onClick={() => onClickOverlay(slideId)} animate={{opacity:1}} exit={{opacity:0}}></Overlay>
          <BigMovie 
            layoutId={bigMovieMatch.params.movieId+slideId}
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
    </Wrapper>
  );
}

export default Slider;
