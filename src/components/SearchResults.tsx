import type { Track } from "../types/Track"

type SearchResultsProps = {
    results: Track[];
    onAdd: (track: Track) => void;
}

export default function SearchResults({ results, onAdd }: SearchResultsProps) {
    return (
        <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">
                Results
            </h3>

            {results.length === 0 ? (
                <p>No Results Yet</p>
            ) : (
                results.map((track) => (
                    <div
                        key={track.id}
                        className="flex items-center justify-between py-2 border-b border-neutral-700"
                    >
                        <div>
                            <p className="font-medium">{track.name}</p>
                            <p className="text-sm text-neutral-400">
                                {track.artist} • {track.album}
                            </p>
                        </div>

                        <button 
                            onClick={() => onAdd(track)}
                            className="px-3 py-1 rounded bg-green-500 text-black text-sm font-semibold hover:bg-green-400"
                        >
                            Add
                        </button>
                    </div>
                ))
            )}
        </div>
    );

}