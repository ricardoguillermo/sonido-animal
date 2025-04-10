import React, { useState, useRef, useEffect, useCallback } from "react";
import AnimalButton from "./components/AnimalButton";
import ScoreBoard from "./components/ScoreBoard";
import animals from "./data/animals"; // Asegúrate de que la ruta sea correcta
import "./App.css"; // Importar la hoja de estilos

function App() {
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0); // Contador de errores
  const [timeLeft, setTimeLeft] = useState(90); // Tiempo límite en segundos
  const [playerName, setPlayerName] = useState(""); // Nombre del jugador
  const [gameOver, setGameOver] = useState(false); // Estado del juego
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [playerSelected, setPlayerSelected] = useState(false); // Estado para habilitar el juego
  const audioRef = useRef(null); // Referencia para el audio
  const timerRef = useRef(null); // Referencia para el temporizador
  const [gameStarted, setGameStarted] = useState(false);
  const [endGameMessage, setEndGameMessage] = useState(null);

  const [players, setPlayers] = useState(() => {
    const storedPlayers = localStorage.getItem("players");
    return storedPlayers
      ? JSON.parse(storedPlayers)
      : [
          { name: "Lady Brunita", image: "/imagen/player1.png", score: 0 },
          { name: "Mister Thiaguito", image: "/imagen/player2.png", score: 0 },
          { name: "Super Abuelo", image: "/imagen/player3.jpg", score: 0 },
          { name: "Baby Máximo", image: "/imagen/player4.jpg", score: 0 },
         { name: "Super Abuela", image: "/imagen/player4.jpg", score: 0 },
        ];
  });

  // Seleccionar un animal aleatorio
  const selectRandomAnimal = () => {
    let newAnimal;
    do {
      const randomIndex = Math.floor(Math.random() * animals.length);
      newAnimal = animals[randomIndex];
    } while (newAnimal === currentAnimal); // Asegurarse de que el nuevo animal sea diferente
    setCurrentAnimal(newAnimal);
    return newAnimal; // Devolver el nuevo animal seleccionado
  };

  // Reproducir el sonido del animal actual
  const playCurrentAnimalSound = () => {
    if (currentAnimal) {
      // stopCurrentSound(); // Detener el sonido actual antes de reproducir uno nuevo
      const audio = new Audio(currentAnimal.sound);
      audioRef.current = audio;
      audio.play().catch((error) => {
        console.error("Error al reproducir el sonido:", error);
      });
    }
  };

  const handleAnimalClick = (animal) => {
    if (gameOver) return; // No hacer nada si el juego terminó

    const aciertoSound = new Audio("/sound/acierto.mp3");
    const errorSound = new Audio("/sound/error.mp3");

    if (animal.name === currentAnimal.name) {
      aciertoSound.play(); // Reproducir sonido de acierto
      setScore((prevScore) => prevScore + 1);

      stopCurrentSound(); // Detener el sonido actual antes de seleccionar uno nuevo

      const newAnimal = selectRandomAnimal(); // Seleccionar un nuevo animal y obtener su valor
      setTimeout(() => {
        if (!gameOver) {
          const audio = new Audio(newAnimal.sound); // Reproducir el sonido del nuevo animal
          audioRef.current = audio;
          audio.play().catch((error) => {
            console.error("Error al reproducir el sonido:", error);
          });
        }
      }, 800); // Retraso para que no se superpongan los sonidos
    } else {
      errorSound.play(); // Reproducir sonido de error
      setErrors((prevErrors) => {
        const newErrors = prevErrors + 1;
        if (newErrors >= 3) {
          console.log({ newErrors });
          endGame(); // Terminar el juego si se alcanzan 3 errores
        }
        return newErrors;
      });
    }
  };

  const endGameCalled = useRef(false); // Nueva referencia

  // termina el juego
  const endGame = useCallback(() => {
    if (endGameCalled.current) return; // Evitar múltiples llamadas
    endGameCalled.current = true; // Marcar que endGame ya fue llamado

    setGameOver(true);
    clearInterval(timerRef.current); // Detener el temporizador

    stopCurrentSound(); // Detener el sonido actual al finalizar el juego

    // Reproducir sonido de aplausos o risa
    const applauseSound = new Audio("/sound/triunfo.mp3");
    const laughSound = new Audio("/sound/derrota.mp3");

    if (score >= 10) {
      applauseSound.play();
      setEndGameMessage(
        <div className="end-game-message">
          <img src="/imagen/triunfo.gif" alt="¡Felicidades!" />
          <p>🎉 ¡Felicidades, {playerName}! Alcanzaste 10 puntos. 🎉</p>
        </div>
      );
    } else {
      laughSound.play();
      setEndGameMessage(
        <div className="end-game-message">
          <img src="/imagen/derrota.gif" alt="¡Juego Terminado!" />
          <p>😂 ¡Juego terminado, {playerName}! No alcanzaste 10 puntos. 😂</p>
        </div>
      );
    }

    // Actualizar el puntaje del jugador actual acumulando el puntaje
    setPlayers((prevPlayers) => {
      const updatedPlayers = prevPlayers.map((player) =>
        player.name === playerName
          ? { ...player, score: player.score + score }
          : player
      );
      localStorage.setItem("players", JSON.stringify(updatedPlayers)); // Guardar en localStorage
      return updatedPlayers;
    });
  }, [gameOver, score, playerName]);

  // Manejar el temporizador
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameOver) {
      endGame(); // Llamar a endGame solo si el juego no ha terminado
    }
    return () => clearInterval(timerRef.current); // Limpiar el temporizador
  }, [gameStarted, timeLeft, gameOver, endGame]);

  // Reiniciar el juego
  const restartGame = () => {
    setScore(0);
    setErrors(0);
    setTimeLeft(90);
    setGameOver(false);
    setGameStarted(true); // Iniciar el juego
    endGameCalled.current = false; // Restablecer la referencia
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

  // Función para detener el sonido actual
  function stopCurrentSound() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      console.log("Audio detenido"); // Detener el audio
      // Reiniciar el audio
    }
  }

  const handleDeletePlayer = (name) => {
    const updatedPlayers = players.filter((player) => player.name !== name);
    setPlayers(updatedPlayers);
    localStorage.setItem("players", JSON.stringify(updatedPlayers)); // Actualizar localStorage
  };

  const clearAllScores = () => {
    const resetPlayers = players.map((player) => ({ ...player, score: 0 }));
    setPlayers(resetPlayers);
    localStorage.setItem("players", JSON.stringify(resetPlayers)); // Actualizar localStorage
  };

  // Iniciar el juego
  useEffect(() => {
    if (playerSelected) {
      selectRandomAnimal();
    }
  }, [playerSelected]);

  return (
    <div className="app-container">
      <h1 className="title">Juego de Sonidos</h1>
      {!playerSelected ? (
        <div>
          <h2 className="subtitle">Selecciona tu jugador</h2>
          <div className="players-container">
            {players.map((player) => (
              <div
                key={player.name}
                className="player-card"
                onClick={() => {
                  setPlayerName(player.name);
                  setPlayerSelected(true);
                }}
              >
                <img
                  src={player.image}
                  alt={player.name}
                  className="player-image"
                />
                <p className="player-name">{player.name}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="player-score-container">
            <div className="player-info">
              <img
                src={players.find((p) => p.name === playerName)?.image}
                alt={playerName}
                className="player-image-selected"
              />
              <h2 className="player-name-selected">{playerName}</h2>
            </div>
            <div className="score-container">
              <h2>Puntaje</h2>
              <p className="score">{score}</p>
            </div>
            <div className="time-container">
              <h2>Tiempo</h2>
              <p className="time">{formatTime(timeLeft)}</p>
            </div>
          </div>
          <p className="info">
            <span className="error-icons">
              {[...Array(errors)].map((_, index) => (
                <span key={index} className="error-icon">
                  ❌
                </span>
              ))}
              {[...Array(3 - errors)].map((_, index) => (
                <span key={index} className="error-icon empty">
                  ⭕
                </span>
              ))}
            </span>
          </p>
          <div className="button-row">
            <button
              className="button home-button"
              onClick={() => {
                endGame(); // Terminar el juego
                setPlayerSelected(false); // Regresar a la pantalla de selección de jugadores
              }}
            >
              <img
                src="/imagen/inicio.png"
                alt="Inicio"
                className="button-icon"
                title="Inicio"
              />
            </button>
            {
              <button className="button restart-button" onClick={restartGame}>
                <img
                  src="/imagen/nuevo_juego.jpg"
                  alt="Reiniciar Juego"
                  className="button-icon"
                  title="Reiniciar Juego"
                />
              </button>
            }

            <button
              className="button play-sound-button"
              onClick={playCurrentAnimalSound}
              disabled={!gameStarted || gameOver}
            >
              <img
                src="/imagen/sonido.png"
                alt="Reproducir Sonido"
                className="button-icon"
                title="Reproducir Sonido"
              />
            </button>
            <button
              className="button nav-button"
              onClick={() => {
                endGame(); // Terminar el juego
                document.getElementById("score-table").scrollIntoView(); // Navegar a la tabla
              }}
            >
              <img
                src="/imagen/tabla_puntaje.png"
                alt="Tabla de Puntajes"
                className="button-icon"
                title="Tabla de Puntajes"
              />
            </button>
            <button
              className="button nav-button"
              onClick={() => {
                endGame(); // Terminar el juego
                document.getElementById("agregar_jugador").scrollIntoView(); // Navegar al formulario
              }}
            >
              <img
                src="/imagen/agregar_jugador.jpg"
                alt="Crear Jugador"
                className="button-icon"
                title="Crear un Jugador"
              />
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
                />
              </button>
            ))}
          </div>
        </>
      )}
      {endGameMessage && (
        <div className="end-game-overlay">
          {endGameMessage}
          <button
            className="button close-message-button"
            onClick={() => setEndGameMessage(null)}
          >
            Cerrar
          </button>
        </div>
      )}
      <br />

      <div id="agregar_jugador" className="add-player-container">
        <h2>Agregar Nuevo Jugador</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const newPlayer = {
              name: e.target.name.value,
              image: e.target.image.value,
              score: 0,
            };
            setPlayers((prevPlayers) => {
              const updatedPlayers = [...prevPlayers, newPlayer];
              localStorage.setItem("players", JSON.stringify(updatedPlayers)); // Guardar en localStorage
              return updatedPlayers;
            });
            e.target.reset(); // Limpiar el formulario
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Nombre del jugador"
            required
          />
          <input
            type="text"
            name="image"
            placeholder="URL de la imagen"
            required
          />
          <button type="submit">Agregar Jugador</button>
        </form>
      </div>
      <div className="score-table-container">
        <div className="score-table-container" id="score-table">
          <h2>Tabla de Puntajes</h2>
          <table className="score-table">
            <thead>
              <tr>
                <th>Jugador</th>
                <th>Puntaje</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.name}>
                  <td>
                    <img
                      src={player.image}
                      alt={player.name}
                      className="player-table-image"
                    />
                    {player.name}
                  </td>
                  <td>{player.score}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDeletePlayer(player.name)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="button clear-scores-button"
            onClick={clearAllScores}
          >
            Borrar Todos los Puntajes
          </button>
        </div>
      </div>
    </div>
  );
}
export default App;
