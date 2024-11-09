import React, { useEffect, useState } from "react";
import axios from "axios";
import "./countDown.css";
import pokjuk from "./pokjuk.mp4";

const App: React.FC = () => {
  const [responseData, setResponseData] = useState<any>(null);
  const [isEnd, setIsEnd] = useState(false);
  const [videoReady, setVideoReady] = useState(false); // 비디오 재생을 위한 상태 추가

  useEffect(() => {
    axios
      .get("https://esports.hanum.us/luckydraw/getWinner", {
        headers: {
          secret: import.meta.env.VITE_API_SECRET_KEY,
        },
      })
      .then((response) => {
        setResponseData(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error Data:", error.response.data);
        } else {
          console.error(error);
        }
      });

    let countdown = 12;
    const spans = document.querySelectorAll<HTMLSpanElement>(".container span");

    function updateCountdown() {
      if (countdown >= 0) {
        spans[10 - countdown].textContent = countdown.toString();
        countdown--;
      } else {
        clearInterval(countdownInterval);
      }
    }

    setTimeout(() => {
      setIsEnd(true);

      // 비디오의 z-index를 999로 변경
      const video = document.querySelector("video");
      if (video) {
        video.style.zIndex = "999";
      }

      // 12.5초 후 비디오 재생
      setVideoReady(true);
    }, 12500); // 12초에서 12.5초로 변경

    const countdownInterval = setInterval(updateCountdown, 1100);

    return () => clearInterval(countdownInterval);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <video
        muted
        loop
        className="background-video"
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
        }}
        ref={(videoElement) => {
          if (videoElement && videoReady) {
            videoElement.play(); // 12.5초 후 비디오 재생
          }
        }}
      >
        <source src={pokjuk} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="container">
        <span>10</span>
        <span>9</span>
        <span>8</span>
        <span>7</span>
        <span>6</span>
        <span>5</span>
        <span>4</span>
        <span>3</span>
        <span>2</span>
        <span>1</span>
        <span>0</span>
      </div>

      {responseData && responseData.data && (
        <div
          style={{
            color: "white",
            display: isEnd ? "flex" : "none",
            gap: "10em",
            position: "absolute", // 비디오 위로 겹치도록
            zIndex: 1000, // 비디오 위로 올리기
          }}
        >
          {responseData.data.slice(0, 2).map((winner: any, index: number) => (
            <div
              key={index}
              className="winner"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div>{winner.userName || "No Name"}</div>
              <div>{winner.userSchool || "No School"}</div>
              <div>{winner.userStudentNumber || "No Student Number"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
