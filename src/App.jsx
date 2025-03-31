import React, { useState } from "react";
import AnimalButton from "./components/AnimalButton";
import ScoreBoard from "./components/ScoreBoard";

const animals = [
  {
    name: "Perro",
    sound: "/sound/perro.mp3",
    image: "/src/assets/imagen/perro.png",
  },
  {
    name: "Gato",
    sound: "/sound/gato.mp3",
    image: "/src/assets/imagen/gato.jpg",
  },
  {
    name: "Pato",
    sound: "/sound/pato.mp3",
    image: "/src/assets/imagen/pato.jpg",
  },
  {
    name: "Oveja",
    sound: "/sound/oveja.mp3",
    image: "/src/assets/imagen/oveja.png",
  },
  {
    name: "Caballo",
    sound: "/sound/caballo.mp3",
    image: "/src/assets/imagen/caballo.jpg",
  },
  {
    name: "Cerdo",
    sound: "/sound/cerdo.mp3",
    image: "/src/assets/imagen/cerdo.jpg",
  },
  {
    name: "Pajaro",
    sound: "/sound/pajaro.mp3",
    image: "/src/assets/imagen/pajaro.jpg",
  },
  {
    name: "Lobo",
    sound: "/sound/lobo.mp3",
    image: "/src/assets/imagen/lobo.png",
  },
  {
    name: "Leon",
    sound: "/sound/leon.mp3",
    image: "/src/assets/imagen/leon.png",
  },
  {
    name: "Rana",
    sound: "/sound/rana.mp3",
    image: "/src/assets/imagen/rana.jpg",
  },
  {
    name: "Mono",
    sound: "/sound/mono.mp3",
    image: "/src/assets/imagen/mono.jpg",
  },
  {
    name: "Elefante",
    sound: "/sound/elefante.mp3",
    image: "/src/assets/imagen/elefante.jpg",
  },
];

function App() {
  const [score, setScore] = useState(0);
  const [currentAnimal, setCurrentAnimal] = useState(null);

  const selectRandomAnimal = () => {
    const randomIndex = Math.floor(Math.random() * animals.length);
    setCurrentAnimal(animals[randomIndex]);
  };

  const playCurrentAnimalSound = () => {
    if (currentAnimal) {
      const audio = new Audio(currentAnimal.sound);
      audio.play().catch((error) => {
        console.error("Error al reproducir el sonido:", error);
      });

      // Detener el audio después de 5 segundos
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0; // Reinicia el audio al inicio
      }, 5000); // 5000 ms = 5 segundos
    }
  };

  const handleAnimalClick = (animal) => {
    if (animal.name === currentAnimal.name) {
      setScore(score + 1);
      selectRandomAnimal();
    } else {
      alert("¡Incorrecto! Intenta de nuevo.");
    }
  };

  React.useEffect(() => {
    selectRandomAnimal();
  }, []);

  return (
    <div>
      <h1>Juego de Sonidos de Animales</h1>
      <ScoreBoard score={score} />
      <button onClick={playCurrentAnimalSound}>Reproducir Sonido</button>
      <div>
        {animals.map((animal) => (
          <AnimalButton
            key={animal.name}
            animal={animal.name}
            sound={animal.sound}
            imagen={animal.image}
            onClick={() => handleAnimalClick(animal)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
