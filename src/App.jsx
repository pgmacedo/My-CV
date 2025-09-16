

import { useState } from 'react';

function App() {
  const [page, setPage] = useState('home');

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', margin: '40px' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <button onClick={() => setPage('home')} style={{ marginRight: '1rem' }}>Home</button>
        <button onClick={() => setPage('about')}>About</button>
      </nav>
      {page === 'home' ? (
        <>
          <h1>My CV</h1>
          <iframe
            src="/CV.pdf"
            title="CV PDF"
            style={{ width: '80vw', height: '80vh', border: '1px solid #ccc' }}
          ></iframe>
        </>
      ) : (
        <>
          <h1>About Me</h1>
          <p>This is the about page for my CV website.</p>
        </>
      )}
    </div>
  );
}

export default App;
