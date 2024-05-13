import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Buscador from './Buscador';

const MiApi = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sorted, setSorted] = useState(false);
  const [pokemonDetails, setPokemonDetails] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
        const data = response.data.results;
        setPokemonData(data);
      } catch (error) {
        console.error('Error fetching Pokemon data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchPokemonDetails = async (name) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const abilities = response.data.abilities.map(ability => ability.ability.name).join(', ');
      const number = response.data.id;
      return { abilities, number };
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
      return { abilities: '', number: '' };
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
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
    const fetchDetails = async () => {
      const details = {};
      for (const pokemon of pokemonData) {
        const { abilities, number } = await fetchPokemonDetails(pokemon.name);
        details[pokemon.name] = { abilities, number };
      }
      setPokemonDetails(details);
    };

    fetchDetails();
  }, [pokemonData]);

  return (
    <div>
      <Buscador
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onSort={handleSort}
      />
      <div className="container">
        {sortPokemon().map((pokemon, index) => (
          <div key={index} className="card">
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetails[pokemon.name]?.number}.png`} alt={pokemon.name} />
            <h3>{pokemon.name}</h3>
            <p>Abilities: {pokemonDetails[pokemon.name]?.abilities}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MiApi;
