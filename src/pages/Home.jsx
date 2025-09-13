import React from "react";
import Navbar from "../components/NavBar";
import Button from "../components/Button";
import me11 from "../assets/images/me1-1.png";
import msgr1 from "../assets/images/msgr-1.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate=useNavigate();
  return (
    <main className="bg-[url('/origbig-1.png')] bg-cover bg-center bg-no-repeat text-text-primary min-h-screen w-screen grid justify-items-center overflow-hidden">
      <div className="relative w-full min-h-screen pt-[70px]">
        {/* Background Image */}
        <div className="relative w-full h-full ">
          {/* Navbar */}
          <Navbar />

          {/* Welcome Section */}
          <section
            className="relative max-w-[746px] mx-auto mt-40 px-4 grid place-items-center"
            aria-label="Welcome section"
          >
            <div className="relative w-full h-[536px]">
              {/* Character */}
              <img
                className="absolute w-[205px] h-[308px] bottom-0 left-0 object-cover"
                src={me11}
                alt="Kawaii character"
                loading="lazy"
              />

              {/* Banner */}
              <img
                className="absolute w-[427px] h-[204px] top-10 left-[153px]"
                src={msgr1}
                alt="Welcome message banner"
                loading="lazy"
              />

              {/* Text */}
              <h1
                className="absolute w-[410px] top-[87px] left-[160px]
                           font-bold text-[2.8rem] text-center leading-tight font-pixelify"
              >
                <span className="text-black">WELCOME TO </span>
                <span className="text-text-primary">KAWAII</span>{" "}
                <span className="text-accent">CORNER</span>
              </h1>

              {/* Next button */}
              <div className="absolute bottom-[140px] right-[300px]">
                <Button onClick={()=>{
                    navigate('/genre')
                }}>NEXT</Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
