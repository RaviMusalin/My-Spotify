import { useEffect, useState } from "react";

type CommunityPlaylist = {
    id: number;
    name: string;
    created_by: string;
    created_at: string;
}

export default function CommunityPlaylists({ onSelect }: { onSelect: (id: number) => void }) {
    const [playlists, setPlaylists] = useState<CommunityPlaylist[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        fetch("https://my-spotify-backend-tj28.onrender.com/community-playlists")
            .then((res) => res.json())
            .then((data) => {
                setPlaylists(data)
                setLoading(false)
            })
            .catch((err) => {
                console.error("Failed to get playlists", err)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <p className="p-6">Loading community playlists...</p>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Community Playlists</h2>

            {playlists.length === 0 && (
                <p className="text-neutral-400">No community playlists yet.</p>
            )}

            <div className="space-y-4">
                {playlists.map((playlist) => (
                    <div
                        key={playlist.id}
                        onClick={() => onSelect(playlist.id)}
                        className="bg-neutral-800 rounded p-4 cursor-pointer hover:bg-neutral-700"
                    >

                        <h3 className="font-semibold text-lg">
                            {playlist.name}
                        </h3>
                        <p className="text-sm text-neutral-400">
                            Created by {playlist.created_by}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
