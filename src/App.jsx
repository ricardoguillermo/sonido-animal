import React, { useState } from "react";
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import "./App.css";

function App() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  return (
    <div className="app-container">
      <h1 className="title">Sonidos de animales</h1>
      {!selectedPlayer ? (
        <StartScreen onPlayerSelected={(name) => setSelectedPlayer(name)} />
      ) : (
        <Game
          playerName={selectedPlayer}
          onReturnHome={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}

export default App;
