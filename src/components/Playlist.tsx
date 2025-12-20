type Track = {
    id: string;
    name: string;
    artist: string;
    album: string;
}

type PlaylistProps = {
    tracks: Track[];
    onRemove: (track: Track) => void;
}

export default function Playlist({ tracks, onRemove }: PlaylistProps) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Playlist</h3>

            {tracks.length === 0 && (
                <p className="text-lg font-semibold mb-2">
                    No Tracks Added Yet
                </p>)}

            {tracks.map((track) => (
                <div key={track.id} className="flex items-center justify-between py-2 border-b border-neutral 700">

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
        </div>
    )
}