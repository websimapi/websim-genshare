window.SettingsTab = ({ currentUser, threshold, setThreshold, spent, setSpent }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-4 mb-4">
                    <img src={currentUser?.avatarUrl} className="w-16 h-16 rounded-full border-2 border-purple-500" />
                    <div>
                        <h2 className="text-xl font-bold">{currentUser?.username}</h2>
                        <p className="text-slate-400 text-sm">Credit Provider</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Session Limit (Credits)</label>
                        <input
                            type="number"
                            value={threshold}
                            onChange={(e) => setThreshold(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none"
                        />
                        <p className="text-xs text-slate-500 mt-1">100 Credits per generation</p>
                    </div>

                    <div className="p-4 bg-slate-900 rounded-lg">
                        <div className="flex justify-between mb-2">
                            <span className="text-slate-300">Credits Spent</span>
                            <span className="font-mono text-purple-400">{spent} / {threshold}</span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${spent >= threshold ? 'bg-red-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min((spent / threshold) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <div className="mt-2 text-xs text-center">
                            {spent >= threshold
                                ? <span className="text-red-400">You are currently rejecting requests</span>
                                : <span className="text-green-400">You are accepting requests</span>
                            }
                        </div>
                    </div>

                    <button
                        onClick={() => setSpent(0)}
                        className="w-full py-2 border border-slate-600 rounded hover:bg-slate-700 text-sm transition-colors"
                    >
                        Reset Session Counter
                    </button>
                </div>
            </div>
        </div>
    );
};

