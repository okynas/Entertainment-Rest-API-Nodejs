import { Link } from "react-router-dom";
import styled from "styled-components";
// import Footer from "./footer";
import Header from "./header";

export default function Home() {

  const ImageContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  `;
  const Image = styled.img`
    width: 500px;
    height: auto;
  `;

  const Header1 = styled.h1`
    font-size: 3rem;
    margin-bottom: 0;
  `;

  const Section1 = styled.section`
  `;

  const Main = styled.main`
    margin: 0 200px;
  `;

  const BrowseBtn = styled.button`
    background-color: #ADBAFF;
    border: none;
    cursor: pointer;
    padding: 14px 10px;
    &:hover {
      opacity: 0.7;
    }
  `;

  const BrowseLink = styled.a`
    text-decoration: none;
    color: #fff;
    padding: 10px 14px;
  `;

  return (
    <>
      <Header title="Home"/>
      <Main>
        <Section1>
          <Header1>0xYnas</Header1>
          <p>Get realtime information about some of the largest and most popular movies and tv-shows</p>
          <BrowseBtn>
            <BrowseLink href="/entertainment">Browse</BrowseLink>
          </BrowseBtn>
        </Section1>
        <ImageContainer>
          <Image src={`/cool_kids.png`}/>
        </ImageContainer>
      </Main>
      {/* <Footer/> */}
    </>
  )
}