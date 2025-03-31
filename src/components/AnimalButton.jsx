import React from "react";

const AnimalButton = ({ animal, sound, imagen, onClick }) => {
  const handleClick = () => {
    const audio = new Audio(sound);
    audio.play();
    onClick(animal);
  };

  return (
    <button onClick={handleClick}>
      {animal.name}
      <img src={imagen} width={50} alt={animal.name} />
    </button>
  );
};

export default AnimalButton;
