import './App.css';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function Home() {
  const [text, setText] = useState('');
  const [isReady, setIsReady] = useState(false);

  const handleChange = (e) => setText(e.target.value);

  useEffect(() => {
    if (text === 'Ready') setIsReady(true);
    else setIsReady(false);
  }, [text]);

  return (
    <div className='App'>
      <header className='App-header'>
        <img
          hidden={!isReady}
          src='https://www.freeiconspng.com/uploads/file-pokeball-png-0.png'
          className='App-logo'
          alt='logo'
          style={{ padding: '10px' }}
        />
        <b>
          Requirement: Try to show the hidden button and make it clickable that
          goes to /pokedex when the input below is "Ready!" remember to hide the
          hint away when Ready! is in the textbox.
        </b>
        <p>Are you ready to be a pokemon master?</p>
        <input type='text' name='name' onChange={handleChange} />
        {!isReady ? (
          <span style={{ color: 'red' }}>I am not ready yet!</span>
        ) : (
          <button>
            <NavLink to='/pokedex'>Click me</NavLink>
          </button>
        )}
      </header>
    </div>
  );
}

export default Home;
