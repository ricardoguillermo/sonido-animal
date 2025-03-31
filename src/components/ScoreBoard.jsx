import React from 'react';

const ScoreBoard = ({ score, resetGame }) => {
    return (
        <div className="scoreboard">
            <h2>Puntaje: {score}</h2>
            <button onClick={resetGame}>Reiniciar Juego</button>
        </div>
    );
};

export default ScoreBoard;