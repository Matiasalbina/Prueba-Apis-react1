import React from 'react';

const Buscador = ({ searchTerm, onSearch, onSort }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search Pokemon"
        value={searchTerm}
        onChange={onSearch}
      />
      <button onClick={onSort}>Sort Alphabetically</button>
    </div>
  );
}

export default Buscador;
