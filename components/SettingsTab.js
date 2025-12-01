window.SettingsTab = ({ currentUser, currentPeer, threshold, setThreshold, spent, setSpent, runSelfTest }) => {
    const avatarUrl = currentPeer?.avatarUrl || currentUser?.avatarUrl;
    const displayName = currentPeer?.username || currentUser?.username;

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-4 mb-4">
                    <img
                        src={avatarUrl}
                        className="w-16 h-16 rounded-full border-2 border-purple-500 bg-slate-700"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64'; }}
                    />
                    <div>
                        <h2 className="text-xl font-bold">{displayName}</h2>
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

            {/* Self-Diagnostic / Trigger Section */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl">⚡</span> Self-Diagnostic
                </h3>

                <div className="bg-blue-900/20 border border-blue-800/50 p-4 rounded-lg mb-4">
                    <div className="flex gap-3">
                        <div className="text-2xl">⚠️</div>
                        <div>
                            <h4 className="font-bold text-blue-200 text-sm mb-1">Permissions Check</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Please ensure you click <span className="text-white font-bold bg-slate-700 px-1 rounded">Always Allow</span> if this application asks for permission to play sounds or stay active. This is required for background processing to work reliably.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={runSelfTest}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-purple-900/20 active:scale-95 flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    Trigger Image Request (Img2Img Self-Test)
                </button>
                <p className="text-xs text-slate-500 mt-2 text-center">
                    Initiates a real generation request to yourself using your credits.
                </p>
            </div>
        </div>
    );
};

