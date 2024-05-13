import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Buscador from './Buscador';

const MiApi = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sorted, setSorted] = useState(false);
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
        const data = response.data.results;
        setPokemonData(data);
        setLoading(false);
  
        const detailsPromises = data.map(async pokemon => {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
          const { abilities, id } = response.data;
          const abilitiesList = abilities.map(ability => ability.ability.name).join(', ');
          return { name: pokemon.name, abilities: abilitiesList, number: id };
        });
  
        const pokemonDetails = await Promise.all(detailsPromises);
        const detailsMap = pokemonDetails.reduce((acc, curr) => {
          acc[curr.name] = { abilities: curr.abilities, number: curr.number };
          return acc;
        }, {});
        
        setPokemonDetails(detailsMap);
      } catch (error) {
        console.error('Error fetching Pokemon data:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setNoResults(false);
  };

  const handleSort = () => {
    setSorted(!sorted);
  };

  const sortPokemon = () => {
    const sortedPokemon = pokemonData
      .filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));

    return sorted ? sortedPokemon.reverse() : sortedPokemon;
  };

  useEffect(() => {
    // Verifica si hay resultados de búsqueda y actualiza el estado correspondiente
    setNoResults(sortPokemon().length === 0);
  }, [pokemonData, searchTerm, sorted]);

  return (
    <div>
      <Buscador
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onSort={handleSort}
      />
      <div className="container">
        {loading ? (
          <div className="center">
            <p className="loading">Cargando...</p>
          </div>
        ) : noResults ? (
          <div className="center">
            <p className="no-results">No hay coincidencias</p>
          </div>
        ) : (
          sortPokemon().map((pokemon, index) => (
            <div key={pokemon.name} className="card">
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetails[pokemon.name]?.number}.png`} alt={pokemon.name} />
              <h3>{pokemon.name}</h3>
              <p>Abilities: {pokemonDetails[pokemon.name]?.abilities}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MiApi;
