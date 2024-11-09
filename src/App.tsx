import React, { useEffect, useState } from "react";
import axios from "axios";
import "./countDown.css";

const App: React.FC = () => {
  const [responseData, setResponseData] = useState<any>(null);
  const [isEnd, setIsEnd] = useState(false);

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
    }, 12500);

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
      }}
    >
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
                fontFamily: "revert",
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
