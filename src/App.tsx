import React from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import './styles.css'; // Optional global styles

const App: React.FC = () => {
  return (
    <div className="app-container">
      <h1>My React Components Demo</h1>
      <section>
        <h2>Search Bar</h2>
        <SearchBar />
      </section>
      {/* Add more sections for future components */}
    </div>
  );
};

export default App;