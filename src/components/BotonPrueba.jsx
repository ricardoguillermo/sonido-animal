import React from "react";

const BotonPrueba = ({ imagen }) => {
  // const imagenSrc = "/src/assets/imagen/perro.png";

  return (
    <button>
      <img src={imagen} width={50} alt="Botón Imagen" />
    </button>
  );
};

export default BotonPrueba;
