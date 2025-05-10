import React, { useState } from "react";
import styled from "styled-components";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Nav>
        <LogoLink to="/">
          ELearning
        </LogoLink>

      <Hamburger onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </Hamburger>

      <Menu isOpen={isOpen}>
        <MenuLink to="/">Home</MenuLink>
        <MenuLink to="/about">About</MenuLink>
        <MenuLink to="/blog">Blog</MenuLink>
        <MenuLink to="/courses">Courses</MenuLink>
        <MenuLink to="/faq">FAQ</MenuLink>
        <MenuLink to="/auth">
          <FaUser size={"25px"} />
        </MenuLink>
      </Menu>
    </Nav>
  );
};

export default Navbar;



const LogoLink = styled(Link)`
font-size: 1.8rem;
font-weight: bold;
text-decoration: none;
color: white;
`
const Nav = styled.nav`
  padding: 0 2rem;
  height: 70px;
  background: #6a0dad; /* purple */
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;
  color: white;
`;

const Hamburger = styled.div`
  display: none;
  cursor: pointer;
  font-size: 1.8rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Menu = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  z-index: 200000000;
  @media (max-width: 768px) {
    flex-direction: column;
    background: #6a0dad;
    position: absolute;
    align-items: flex-start;
    top: 70px;
    left: ${({ isOpen }) => (isOpen ? "0" : "-100%")};
    width: 100%;
    padding: 1rem 2rem;
    transition: left 0.3s ease-in-out;
  }
`;

const MenuLink = styled(Link)`
  text-decoration: none;
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #ffd6ff;
  }
`;
