import React from "react";
import styled from "styled-components";

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
      </HeroContent>

      <HeroImageWrapper>
        {/* Optional image - You can replace src with any illustration or SVG */}
        <HeroImage src="https://via.placeholder.com/500x350?text=Illustration" alt="Hero Illustration" />
      </HeroImageWrapper>
    </HeroContainer>
  );
};

export default Hero;


const HeroContainer = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5rem 8%;
  background: white;
  color: #2d2d2d;
  background-color:rgb(234, 234, 234);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 3rem 5%;
  }
`;

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
  height: auto;
  border-radius: 1rem;
`;
