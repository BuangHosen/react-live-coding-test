import './App.css';
import { useState, useEffect, useCallback } from 'react';
import ReactLoading from 'react-loading';
import axios from 'axios';
import Modal from 'react-modal';
import { TablePagination } from '@material-ui/core';

import applySort from './utils/sort';
import applyFilters from './utils/filter';
import applyPagination from './utils/pagination';

//  Requirements:
//  1. Call this api:https://pokeapi.co/api/v2/pokemon to get pokedex ✅
//  2. Implement React Loading and show it during API call ✅
//  3. when hover, change the pokemon name ❌
//  4. when clicked, show the modal below ✅
//  5. Add a search bar on top of the bar for searching, search will run on keyup event ✅
//  6. Implement sorting and pagination ✅
//  7. Commit your codes after done ✅

const sortOptions = [
  {
    value: 'name|asc',
    label: 'Pokemon name (A-Z)',
  },
  {
    value: 'name|desc',
    label: 'Pokemon name (Z-A)',
  },
];

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: 'black',
    color: 'white',
  },
  overlay: { backgroundColor: 'grey' },
};

function PokeDex() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [pokemonInformation, setPokemonInformation] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);

  // Usually query is done on backend with indexing solutions
  const filteredPokemons = applyFilters(pokemons, query);
  const sortedPokemons = applySort(filteredPokemons, sort);
  const paginatedPokemons = applyPagination(sortedPokemons, page, limit);

  const handleMouseOver = useCallback(() => {
    //  do something
  }, []);

  const handleMouseOut = useCallback(() => {
    //  do something
  }, []);

  const handleClick = useCallback((pokemon) => {
    setPokemonDetail(pokemon);
  }, []);

  const handleChange = useCallback((event) => {
    setQuery(event.target.value);
  }, []);

  const handleSort = useCallback((event) => {
    setSort(event.target.value);
  }, []);

  const handlePageChange = useCallback((_, newPage) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((event) => {
    setLimit(event.target.value);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    axios.get('https://pokeapi.co/api/v2/pokemon').then((res) => {
      setPokemons(res.data.results);
      setIsLoading(false);
    });
  }, [setIsLoading]);

  useEffect(() => {
    if (pokemonDetail) {
      axios
        .get(pokemonDetail?.url)
        .then((res) => setPokemonInformation(res.data));
    }
  }, [pokemonDetail]);

  const renderPokedex = () =>
    isLoading ? (
      <div className='App'>
        <header className='App-header'>
          <ReactLoading type='bubbles' color='#fff' />
        </header>
      </div>
    ) : (
      <>
        <h1>Welcome to pokedex !</h1>
        <input placeholder='Search your pokemon...' onChange={handleChange} />
        <select value={sort} onChange={handleSort}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {paginatedPokemons.map((pokemon, index) => (
          <b
            key={`${index}`}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => handleClick(pokemon)}
          >
            {pokemon.name}
          </b>
        ))}
        <TablePagination
          style={{ color: '#fff' }}
          component='div'
          count={pokemons.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </>
    );

  return (
    <div>
      <header className='App-header'>{renderPokedex()}</header>
      {pokemonDetail && (
        <Modal
          isOpen={pokemonDetail}
          contentLabel={pokemonDetail?.name || ''}
          ariaHideApp={false}
          onRequestClose={() => {
            setPokemonDetail(null);
          }}
          style={customStyles}
        >
          <div>
            <img
              src={pokemonInformation?.sprites?.front_default}
              alt='Pokemen'
            />
            Stats:
            <ul>
              {pokemonInformation?.stats?.map(({ base_stat, stat }, index) => (
                <li key={`${index}`}>{`${stat.name} - ${base_stat}`}</li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PokeDex;
