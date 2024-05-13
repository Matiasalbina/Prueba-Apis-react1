import React from 'react';
import Buscador from './components/Buscador';
import MiApi from './components/MiApi';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <div className="App">
      <h1>Pokedex</h1>
      <MiApi Buscador={Buscador} />
    </div>
  );
}

export default App;
