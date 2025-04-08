function AnimalButton({ animal, imagen, onClick, title }) {
  return (
    <button className="animal-button" onClick={onClick} title={title}>
      <img src={imagen} width={100} alt={animal} className="animal-image" />
    </button>
  );
}

export default AnimalButton;
