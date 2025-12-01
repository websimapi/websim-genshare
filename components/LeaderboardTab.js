window.LeaderboardTab = ({ leaderboard }) => {
    return (
        <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-center mb-4">Top Processors</h2>
            {leaderboard.length === 0 ? (
                <div className="text-center text-slate-500 py-10">Loading stats...</div>
            ) : (
                leaderboard.map((record, i) => (
                    <div key={record.id} className="flex items-center gap-4 bg-slate-800 p-3 rounded-lg border border-slate-700">
                        <div className="font-bold text-2xl text-slate-600 w-8 text-center">#{i + 1}</div>
                        <img
                            src={`https://images.websim.com/avatar/${record.username}`}
                            className="w-10 h-10 rounded-full bg-slate-700"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                        />
                        <div className="flex-1">
                            <div className="font-bold">{record.username}</div>
                            <div className="text-xs text-slate-400">Processed: {record.total_processed} reqs</div>
                        </div>
                        <div className="text-purple-400 font-mono text-sm">
                            {record.total_processed * 100} Cr
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

