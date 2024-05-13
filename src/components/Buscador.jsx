import React from 'react';

const Buscador = ({ searchTerm, onSearch, onSort }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Buscar Pokemon"
        value={searchTerm}
        onChange={onSearch}
      />
      <button onClick={onSort}>Ordenar alfabeticamente</button>
    </div>
  );
}

export default Buscador;
