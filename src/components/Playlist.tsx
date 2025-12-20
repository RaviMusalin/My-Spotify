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

