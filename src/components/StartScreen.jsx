import React, { useState, useEffect } from "react";
import "./StartScreen.css"; // Asegúrate de que la ruta sea correcta

export default function StartScreen({ onPlayerSelected }) {
  const [players, setPlayers] = useState(() => {
    const stored = localStorage.getItem("players");
    return stored ? JSON.parse(stored) : [];
  });

  const defaultAvatar = "https://api.dicebear.com/7.x/thumbs/svg?seed=random";

  const handleAddPlayer = (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const image = e.target.image.value.trim() || defaultAvatar;

    if (!name) return;

    const newPlayer = { name, image, score: 0 };
    const updated = [...players, newPlayer];
    setPlayers(updated);
    localStorage.setItem("players", JSON.stringify(updated));
    e.target.reset();
  };

  const handleDeletePlayer = (nameToDelete) => {
    const updated = players.filter((p) => p.name !== nameToDelete);
    setPlayers(updated);
    localStorage.setItem("players", JSON.stringify(updated));
  };

  const handleResetScores = () => {
    const reset = players.map((p) => ({ ...p, score: 0 }));
    setPlayers(reset);
    localStorage.setItem("players", JSON.stringify(reset));
  };

  return (
    <div className="start-container">
      <h2>Selecciona tu jugador</h2>
      <div className="players-container">
        {players.map((player) => (
          <div key={player.name} className="player-card">
            <img
              src={player.image}
              alt={player.name}
              width={140}
              height={140}
              className="player-image"
              onClick={() => onPlayerSelected(player.name)}
              style={{ cursor: "pointer" }}
            />
            <p>{player.name}</p>
            <button
              id="borrar-jugador"
              onClick={() => handleDeletePlayer(player.name)}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="form-section">
        <h3>Agregar Nuevo Jugador</h3>
        <form onSubmit={handleAddPlayer}>
          <input name="name" placeholder="Nombre" required />
          <input name="image" placeholder="URL de Imagen (opcional)" />
          <button type="submit">Agregar</button>
        </form>
      </div>

      <div className="table-section">
        <h3>Tabla de Puntajes</h3>
        <table>
          <thead>
            <tr>
              <th>Jugador</th>
              <th>Puntaje</th>
              <th>Trofeo</th>
            </tr>
          </thead>
          <tbody>
            {[...players]
              .sort((a, b) => b.score - a.score)
              .map((p, i) => (
                <tr key={p.name}>
                  <td
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img src={p.image} alt={p.name} width="30" /> {p.name}
                  </td>
                  <td>{p.score}</td>
                  <td>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : ""}
                  </td>
                  {/* <td>
                    <button onClick={() => handleDeletePlayer(p.name)}>
                      Eliminar
                    </button>
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
        <button
          id="borrarpuntajes"
          onClick={handleResetScores}
          style={{ marginTop: "10px" }}
        >
          🧹 Borrar todos los puntajes
        </button>
      </div>
    </div>
  );
}
