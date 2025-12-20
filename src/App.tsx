import { useState } from 'react'
import './App.css'
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from "./components/Playlist";



type Track = {
  id: string;
  name: string;
  artist: string;
  album: string;
}

export default function App() {
  const [searchResults, setSearchResults] = useState<Track[]>([]) // Search Results
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]) // Tracks in Playlist
  const [playlistName, setPlaylistName] = useState<string>("")


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

  function handleAdd(track: Track) {
    // Check for duplicates
    const alreadyInPlaylist = playlistTracks.some((savedTrack) => savedTrack.id === track.id)

    if (alreadyInPlaylist) return;

    setPlaylistTracks((prev) => [...prev, track])
  }

  function handleRemove(track: Track) {
    setPlaylistTracks((prev) => prev.filter((t) => t.id !== track.id))
  }


  return (
    <div className='min-h-screen bg-neutral-900 text-white'>
      <header className='flex items-center justify-between px-6 border-b border-neutral-800'>
        <h1 className='text-xl font-bold'>Final Spotify</h1>
      </header>


      <button className="px-4 py-2 rounded bg-green-500 text-black font-semibold hover:bg-green-400">
        Login to Spotify
      </button>

      <main className="grid grid-cols-3 gap-6 p-6">
        {/* Search */}
        <SearchBar onSearch={handleSearch} />

        <SearchResults results={searchResults} onAdd={handleAdd} />

        <section className="bg-neutral-800 rounded p-4">
          <Playlist
            tracks={playlistTracks}
            onRemove={handleRemove}
            name={playlistName}
            onNameChange={setPlaylistName}
  
          />
        </section>

      </main>
    </div>


  );
}