window.Header = ({ tab, setTab }) => {
    return (
        <header className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center z-10">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                GenShare
            </h1>
            <div className="flex gap-2">
                <button
                    onClick={() => setTab('generate')}
                    className={`px-3 py-1 rounded text-sm ${tab === 'generate' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                    Gen
                </button>
                <button
                    onClick={() => setTab('gallery')}
                    className={`px-3 py-1 rounded text-sm ${tab === 'gallery' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                    Gallery
                </button>
                <button
                    onClick={() => setTab('leaderboard')}
                    className={`px-3 py-1 rounded text-sm ${tab === 'leaderboard' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                    Top
                </button>
                <button
                    onClick={() => setTab('settings')}
                    className={`px-3 py-1 rounded text-sm ${tab === 'settings' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                    Me
                </button>
            </div>
        </header>
    );
};

