import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";

import "./style.scss";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/cinemx.png";

const Header = () => {
  //states creating
    const [show, setShow] = useState("top");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [query, setQuery] = useState("");
    const [showSearch, setShowSearch] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    //all new pages start showing top
    useEffect(()=>{
      window.scrollTo(0,0);
    },[location])

    const controlNavBar = () =>{
        if(window.scrollY > 200){
          if(window.scrollY > lastScrollY && !mobileMenu){
            setShow("hide")
          }else{
            setShow("show")
          }
          setLastScrollY(window.scrollY);
        }else{
          setShow("top");
        }
    }

    useEffect(()=>{
      window.addEventListener("scroll",controlNavBar)
      return ()=>{
        window.removeEventListener("scroll",controlNavBar)
      }
    },[lastScrollY])

    const openSearch = () =>{
      setMobileMenu(false);
      setShowSearch(true)
    }

    const openMobileMenu = () =>{
      setMobileMenu(true);
      setShowSearch(false)
    }

    const searchQueryHandler = (event)=>{
      //if user type search query and press enter, and search query not empty, then api call
      if(event.key === 'Enter' && query.length >0 ){
          navigate(`/search/${query}`);

          setTimeout(()=>{
            setShowSearch(false)
          },1000)
      }
    }

    const navigationHandler = (type) =>{
      if(type === "movie"){
        navigate('/explore/movie')
      }else{
        navigate('/explore/tv')
      }
      setMobileMenu(false);
    }

    return (
        <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
          <ContentWrapper>
            <div className="logo" onClick={()=> navigate("/")}>
            <svg id="logo-35" width="50" height="39" viewBox="0 0 50 39" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" class="ccompli1" fill="#007AFF"></path> <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" class="ccustom" fill="#312ECB"></path> </svg>            </div>
            <ul className="menuItems">
              <li className="menuItem" onClick={()=>{navigationHandler("movie")}}>Movies</li>
              <li className="menuItem" onClick={()=>{navigationHandler("tv")}}>TV Shows</li>
              <li className="menuItem">
                <HiOutlineSearch onClick={openSearch}/>
              </li>
            </ul>

            <div className="mobileMenuItems">
            <HiOutlineSearch onClick={openSearch}/>
            {mobileMenu ? (<VscChromeClose onClick={()=>{setMobileMenu(false)}}/>) : (<SlMenu onClick={openMobileMenu}/>)} 
            </div>
          </ContentWrapper>
         { showSearch && <div className="searchBar">
            <ContentWrapper>
            <div className="searchInput">
              <input type="text" placeholder='Search for movie or TV show..' onChange={(e)=> setQuery(e.target.value)} onKeyUp={searchQueryHandler}/>
              <VscChromeClose onClick={()=>{setShowSearch(false)}}/>
            </div>
            </ContentWrapper>
          </div>}
        </header>
    );
};

export default Header;