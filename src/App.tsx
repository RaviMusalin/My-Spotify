// import { useState } from 'react'
import './App.css'
import SearchBar from './components/SearchBar';

import { useState } from 'react'

type Track =  {
  id: string;
  name: string;
  artist: string;
  album: string;
}

export default function App() {
  const [searchResults, setSearchResults] = useState<Track[]>([])

  function handleSearch(term: string) {
  const fakeResults: Track[] = [
    {
      id: "1",
      name: `Song matching "${term}"`,
      artist: "Demo Artist",
      album: "Demo Album",
    },
    {
      id: "2",
      name: "Another Demo Song",
      artist: "Demo Artist 2",
      album: "Demo Album 2",
    },
  ];

  setSearchResults(fakeResults);
  console.log(searchResults)
}


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
          <SearchBar onSearch={handleSearch}/>
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

