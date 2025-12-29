import type { Track } from "../types/Track"

type PlaylistProps = {
  tracks: Track[];
  name: string;
  onNameChange: (name: string) => void;
  onRemove: (track: Track) => void;
  onSave: () => void; // ✅ add this
};



export default function Playlist({ tracks, name, onNameChange, onRemove, onSave }: PlaylistProps) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Playlist</h3>
            <input
                type="text"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full mb-3 px-2 py-1 rounded bg-neutral-700 text-white outline-none"
                placeholder="Enter Playlist Name Here"
            />


            {tracks.length === 0 && (
                <p className="text-lg font-semibold mb-2">
                    No Tracks Added Yet
                </p>)}

            {tracks.map((track) => (
                <div key={track.id} className="flex items-center justify-between py-2 border-b border-neutral-700">

                    <div>
                        <p className="font-medium">{track.name}</p>
                        <p className="text-sm text-neutral-400">
                            {track.artist} • {track.album}
                        </p>
                    </div>

                    <button
                        onClick={() => onRemove(track)}
                        className="px-3 py-1 rounded bg-red-500 text-black text-sm font-semibold hover:bg-red-400"
                    >
                        Remove
                    </button>
                </div>
            ))}

           <button
  disabled={!tracks.length}
  onClick={onSave}
  className="mt-4 w-full px-3 py-2 rounded bg-green-500 text-black font-semibold hover:bg-green-400 disabled:opacity-50"
>
  Save to Spotify
</button>

        </div>
    )
}