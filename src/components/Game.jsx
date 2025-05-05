import React, { useState, useRef, useEffect, useCallback } from "react";
import animals from "../data/animals";

export default function Game({ playerName, onReturnHome }) {
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameOver, setGameOver] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [gameStarted, setGameStarted] = useState(true);
  const [endGameMessage, setEndGameMessage] = useState(null);
  const [showFinalButtons, setShowFinalButtons] = useState(false);
  const [players, setPlayers] = useState(() => {
    const storedPlayers = localStorage.getItem("players");
    return storedPlayers ? JSON.parse(storedPlayers) : [];
  });

  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const endGameCalled = useRef(false);

  const playFinalSound = (sound) => {
    sound.play();
    sound.onended = () => setShowFinalButtons(true);
  };

  const selectRandomAnimal = () => {
    let newAnimal;
    do {
      const randomIndex = Math.floor(Math.random() * animals.length);
      newAnimal = animals[randomIndex];
    } while (newAnimal === currentAnimal);
    setCurrentAnimal(newAnimal);
    return newAnimal;
  };

  const stopCurrentSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const playCurrentAnimalSound = () => {
    if (currentAnimal) {
      const audio = new Audio(currentAnimal.sound);
      audioRef.current = audio;
      audio.play().catch((error) => {
        console.error("Error al reproducir el sonido:", error);
      });
    }
  };

  const endGame = useCallback(() => {
    if (endGameCalled.current) return;
    endGameCalled.current = true;

    setGameOver(true);
    clearInterval(timerRef.current);
    stopCurrentSound();

    const applauseSound = new Audio("/sound/triunfo.mp3");
    const laughSound = new Audio("/sound/derrota.mp3");

    if (score >= 10) {
      playFinalSound(applauseSound);
      setEndGameMessage(
        <div className="end-game-message">
          <img
            src="/imagen/triunfo.gif"
            alt="¡Felicidades!"
            style={{
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: -1,
            }}
          />
          <p>🎉 ¡Felicidades, {playerName}! Alcanzaste 10 puntos. 🎉</p>
        </div>
      );
    } else {
      playFinalSound(laughSound);
      setEndGameMessage(
        <div className="end-game-message">
          <img
            src="/imagen/derrota.gif"
            alt="¡Juego Terminado!"
            style={{
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: -1,
            }}
          />
          <p>😂 ¡Juego terminado, {playerName}! No alcanzaste 10 puntos. 😂</p>
        </div>
      );
    }

    const updatedPlayers = players.map((player) =>
      player.name === playerName
        ? { ...player, score: player.score + score }
        : player
    );
    setPlayers(updatedPlayers);
    localStorage.setItem("players", JSON.stringify(updatedPlayers));
  }, [score, playerName, players]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameOver) {
      endGame();
    }
    return () => clearInterval(timerRef.current);
  }, [gameStarted, timeLeft, gameOver, endGame]);

  useEffect(() => {
    selectRandomAnimal();
  }, []);

  const restartGame = () => {
    setScore(0);
    setErrors(0);
    setTimeLeft(90);
    setGameOver(false);
    setGameStarted(true);
    setShowFinalButtons(false);
    endGameCalled.current = false;
    selectRandomAnimal();
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleAnimalClick = (animal) => {
    if (gameOver) return;

    const aciertoSound = new Audio("/sound/acierto.mp3");
    const errorSound = new Audio("/sound/error.mp3");

    if (animal.name === currentAnimal.name) {
      aciertoSound.play();
      setScore((prev) => prev + 1);
      stopCurrentSound();
      const newAnimal = selectRandomAnimal();
      setTimeout(() => {
        if (!gameOver) {
          const audio = new Audio(newAnimal.sound);
          audioRef.current = audio;
          audio.play().catch((error) => {
            console.error("Error al reproducir el sonido:", error);
          });
        }
      }, 800);
    } else {
      errorSound.play();
      setErrors((prevErrors) => {
        const newErrors = prevErrors + 1;
        if (newErrors >= 5) {
          endGame();
        }
        return newErrors;
      });
    }
  };

  return (
    <div className="game-container">
      <h1>Jugador: {playerName}</h1>
      <div className="score-time-errors">
        <p>Puntaje: {score}</p>
        <p>Errores: {[...Array(errors)].map(() => "❌").join(" ")}</p>

        <p>Tiempo: {formatTime(timeLeft)}</p>
      </div>
      <div className="button-row">
        <button className="botonpre" onClick={onReturnHome}>
          🏠 Inicio
        </button>

        <button
          className="botonpre"
          onClick={playCurrentAnimalSound}
          disabled={!gameStarted || gameOver}
        >
          🔊 Sonido
        </button>
      </div>
      <div className="animals-container">
        {animals.map((animal) => (
          <button
            key={animal.name}
            className="animal-button"
            onClick={() => handleAnimalClick(animal)}
            disabled={!gameStarted || gameOver}
          >
            <img
              src={animal.image}
              alt={animal.name}
              className="animal-image"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "contain",
                borderRadius: "50%",
              }}
            />
            <p>{animal.name}</p>
          </button>
        ))}
      </div>
      {endGameMessage && (
        <div className="end-game-overlay">
          {endGameMessage}
          <h3>🏆 Ranking Top 5</h3>
          <ol>
            {players
              .sort((a, b) => b.score - a.score)
              .slice(0, 5)
              .map((p, i) => (
                <li key={i}>
                  {p.name}: {p.score} puntos
                </li>
              ))}
          </ol>
          <button
            onClick={() => setEndGameMessage(null)}
            disabled={!showFinalButtons}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}
