// import { useState } from 'react'
import './App.css'
import SearchBar from './components/SearchBar';

export default function App() {
  return (
    <div className='min-h-screen bg-neutral-900 text-white'>
      {/* Header*/}
      <header className='flex items-center justify-between px-6 border-b border-neutral-800'>
        <h1 className='text-xl font-bold'>Final Spotify</h1>
      </header>


      {/* Login Button */}
      <button className="px-4 py-2 rounded bg-green-500 text-black font-semibold hover:bg-green-400">
          Login to Spotify
      </button>

      {/* Main Content */}
     <main className="grid grid-cols-3 gap-6 p-6">
        {/* Search */}
        <section className="col-span-2 bg-neutral-800 rounded p-4">
          <SearchBar/>
        </section>

        {/* Playlist */}
        <section className="bg-neutral-800 rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Playlist</h2>
          <p className="text-neutral-400">
            Playlist UI goes here
          </p>
        </section>
      </main>
    </div>

    
  );
}

