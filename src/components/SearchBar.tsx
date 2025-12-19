import { useState } from "react";

type SearchBarProps = {
    onSearch: (term: string) => void
}

export default function SearchBar( { onSearch }: SearchBarProps) {
    const [term, setTerm] = useState("")

    function handleSearch() {
        if (!term.trim()) return;

        onSearch(term)
    }

    return (
        <div className="flex gap-2">
            <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search for song, artist, or album"
                className="flex-1 px-3 py-2 rounded bg-neutral-700 text-white outline-none"
                />
            <button 
                onClick={handleSearch}
                className="px-4 py-2 rounded bg-green-500 text-black font-semibold hover:bg-green-400"
            >Search</button>
        </div>
    )
}