import './App.css';
import { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import axios from 'axios';
import Modal from 'react-modal';
import { TablePagination } from '@material-ui/core';

import applySort from './utils/sort';
import applyFilters from './utils/filter';
import applyPagination from './utils/pagination';

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

function PokeDex() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [pokemonInformation, setPokemonInformation] = useState({});

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

  // Usually query is done on backend with indexing solutions
  const filteredPokemons = applyFilters(pokemons, query);
  const sortedPokemons = applySort(filteredPokemons, sort);
  const paginatedPokemons = applyPagination(sortedPokemons, page, limit);

  const handleMouseOver = () => console.log('1');
  const handleMouseOut = () => console.log('2');
  const handleClick = (pokemon) => setPokemonDetail(pokemon);
  const handleChange = (e) => setQuery(e.target.value);
  const handleSort = (e) => setSort(e.target.value);
  const handlePageChange = (event, newPage) => setPage(newPage);
  const handleLimitChange = (event) => setLimit(event.target.value);

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

  if (!isLoading && pokemons.length === 0) {
    return (
      <div>
        <header className='App-header'>
          <h1>Welcome to pokedex !</h1>
          <h2>Requirement:</h2>
          <ul>
            <li>
              Call this api:https://pokeapi.co/api/v2/pokemon to get pokedex
            </li>
            <li>Implement React Loading and show it during API call</li>
            {/* Not clear */}
            <li>when hover, change the pokemon name</li>
            <li>when clicked, show the modal below</li>
            <li>
              Add a search bar on top of the bar for searching, search will run
              on keyup event
            </li>
            <li>Implement sorting and pagingation</li>
            <li>Commit your codes after done</li>
          </ul>
        </header>
      </div>
    );
  }

  return (
    <div>
      <header className='App-header'>
        {isLoading ? (
          <>
            <div className='App'>
              <header className='App-header'>
                <ReactLoading type='bubbles' color='#fff' />
              </header>
            </div>
          </>
        ) : (
          <>
            <h1>Welcome to pokedex !</h1>
            <input
              placeholder='Search your pokemon...'
              onChange={handleChange}
            />
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
        )}
      </header>
      {pokemonDetail && (
        <Modal
          isOpen={pokemonDetail}
          contentLabel={pokemonDetail?.name || ''}
          onRequestClose={() => {
            setPokemonDetail(null);
          }}
          style={customStyles}
        >
          <div>
            <img src={pokemonInformation?.sprites?.front_default} alt='' />
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
