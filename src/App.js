import React, { useState } from 'react';
import Table from './components/table';
import io from 'socket.io-client';
import './App.css';

const socket = io.connect('http://localhost:3001');

function App() {
  const [table, setTable] = useState('');
  const [userName, setUserName] = useState('');

  const [showTable, setShowTable] = useState(false);

  // adds the user to a specific table (socket room)
  const joinTable = () => {
    if (!table !== '') {
      socket.emit('joinTable', table);
      socket.emit('setPlayer', userName);
      setShowTable(true);
    }
  };

  return (
    <div className='table'>
      <div className="App">
        <input
          onChange={(event) => {
            setTable(event.target.value);
          }}
          placeholder='Table ID' />
        <button
          onClick={joinTable}
        >Join Table</button>
        <input
          onChange={(event) => {
            setUserName(event.target.value);
          }}
          placeholder='Table ID' />
        {showTable ?
          <Table socket={socket} table={table} />
          : null
        }
      </div>
    </div>
  );
}

export default App;
