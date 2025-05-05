import React from "react";
import styled from "styled-components";
import hero from "../assets/hero-img.png"
import { FaSearch } from "react-icons/fa";

const Hero = () => {
  return (
    <HeroContainer>
      <HeroContent>
        <HeroTitle>
          Build Fast, Launch Faster with <span>Fastcliq</span>
        </HeroTitle>
        <HeroText>
          Empower your ideas with blockchain-integrated fullstack technology. Modern, scalable, and ready for the future.
        </HeroText>
        <HeroButton>Get Started</HeroButton>
        <SearchSection>
            <input type="text" placeholder="Enter a search term"/>
            <FaSearch size={25} color="white" style={{cursor: "pointer", background: "purple", width: "40px", padding: "5px 0", borderRadius: "4px"}}/>
        </SearchSection>
      </HeroContent>

      <HeroImageWrapper>
        {/* Optional image - You can replace src with any illustration or SVG */}
        <HeroImage src={hero} alt="Hero Illustration" />
      </HeroImageWrapper>
    </HeroContainer>
  );
};

export default Hero;


const HeroContainer = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5rem 2%;
  background: white;
  color: #2d2d2d;
  background-color:rgb(234, 234, 234);
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 3rem 5%;
  }
`;

const SearchSection = styled.div`
background: white;
width: 60%;
height: 36px;
margin-top: 40px;
display: flex;
align-items: center;
padding: 4px;

input {
  padding: 4px;
  outline: none;
  border: none;
  width: 100%;
  height: 100%;
}
`

const HeroContent = styled.div`
  max-width: 600px;
  text-align: left;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  color: #6a0dad;
  margin-bottom: 1rem;
  line-height: 1.2;

  span {
    color: #4b0082;
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const HeroText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #444;
  line-height: 1.5;
`;

const HeroButton = styled.span`
  background: #6a0dad;
  color: white;
  border: none;
  padding: 0.9rem 2rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #4b0082;
  }
`;

const HeroImageWrapper = styled.div`
  @media (max-width: 768px) {
    margin-top: 2rem;
  }
`;

const HeroImage = styled.img`
  max-width: 100%;
  height: 400px;
  border-top-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
  border-top-right-radius: 0
  border-bottom-right-radius: 0;

  @media (max-width: 768px) {
    height: auto;
  }
`;
