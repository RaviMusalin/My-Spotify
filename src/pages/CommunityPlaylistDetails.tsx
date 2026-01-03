 import { useEffect, useState } from "react";

type Track = {
  name: string;
  artist: string;
  album: string;
  uri: string;
};

type Playlist = {
  id: number;
  name: string;
  created_by: string;
};

export default function CommunityPlaylistDetails({
  playlistId,
  onBack,
}: {
  playlistId: number;
  onBack: () => void;
}) {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://my-spotify-backend-tj28.onrender.com/community-playlists/${playlistId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setPlaylist(data.playlist);
        setTracks(data.tracks);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load playlist", err);
        setLoading(false);
      });
  }, [playlistId]);

  if (loading) {
    return <p className="p-6">Loading playlist...</p>;
  }

  if (!playlist) {
    return <p className="p-6">Playlist not found.</p>;
  }

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="mb-4 px-3 py-1 rounded bg-neutral-700 hover:bg-neutral-600"
      >
        ← Back to Community
      </button>

      <h2 className="text-2xl font-bold">{playlist.name}</h2>
      <p className="text-sm text-neutral-400 mb-4">
        Created by {playlist.created_by}
      </p>

      <ul className="space-y-2">
        {tracks.map((track, idx) => (
          <li
            key={idx}
            className="bg-neutral-800 rounded p-3"
          >
            <p className="font-medium">{track.name}</p>
            <p className="text-sm text-neutral-400">
              {track.artist} • {track.album}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
