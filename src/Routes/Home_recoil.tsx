import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getMovies } from "../api";
import { IGetMoviesResult } from "../Component/atoms";
import Slider from "../Component/Slider";
import { makeImagePath } from "../util";

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
const SliderWrapper = styled.div`
`;
const SliderTitle = styled.h2`
  font-size: 30px;
  padding: 20px;
`;

const BannerMovieNum = 0;
const slideOffset = 6;   

function Home_recoil() {
  const {data, isLoading} = useQuery<IGetMoviesResult>(["movie", "nowPlaying"], getMovies);

  return (
    <Wrapper>
      {isLoading ? <Loader>Lodiing...</Loader> : (
        <>
          <Banner bgPoster={makeImagePath(data?.results[BannerMovieNum].backdrop_path || "")}>
            <Title>{data?.results[BannerMovieNum].title}</Title>
            <Overview>{data?.results[BannerMovieNum].overview}</Overview>
          </Banner>
        </>
      )}
      <SliderWrapper>
        <SliderTitle>지금 뜨는 콘텐츠</SliderTitle>
        <Slider slideId="1"></Slider>
        <SliderTitle>내가 찜한 콘텐츠</SliderTitle>
        <Slider slideId="2"></Slider>
      </SliderWrapper>
      <SliderWrapper>
        <SliderTitle>지금 뜨는 콘텐츠</SliderTitle>
        <Slider slideId="3"></Slider>
        <SliderTitle>내가 찜한 콘텐츠</SliderTitle>
        <Slider slideId="4"></Slider>
      </SliderWrapper>

    </Wrapper>
  );
}

export default Home_recoil;