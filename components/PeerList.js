window.PeerList = ({ peers, currentUser, room, presence, processingPeerId, sendRequest }) => {
    const { getPeerStatus } = window.AppUtils;

    // Deduplicate peers by username to ensure one selector per person
    const peersMap = new Map();

    // 1. Add "Me" first (Highest priority, ensures correct PFP)
    const myPeer = peers[room.clientId];
    
    if (myPeer) {
        // Use the room's peer data for "Me" to ensure the avatar matches what others see
        peersMap.set(myPeer.username, {
            id: room.clientId,
            username: `${myPeer.username} (Me)`,
            avatarUrl: myPeer.avatarUrl
        });
    } else if (currentUser && room.clientId) {
        // Fallback to local user data if room peer data isn't ready
        peersMap.set(currentUser.username, {
            id: room.clientId,
            username: `${currentUser.username} (Me)`,
            avatarUrl: currentUser.avatarUrl
        });
    }

    // 2. Add other peers (excluding duplicates)
    Object.values(peers).forEach(p => {
        if (p.id === room.clientId) return; // Skip exact self matches by ID

        // Only add if username not already in list (Avoids duplicates/multiple tabs)
        if (p.username && !peersMap.has(p.username)) {
            peersMap.set(p.username, p);
        }
    });

    const allPeers = Array.from(peersMap.values());

    if (allPeers.length === 0 && !currentUser) {
         return (
            <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-700 rounded-lg">
                Waiting for other users to join...<br />
                <span className="text-xs opacity-70">Open this URL in a new tab to test!</span>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-2">
            {allPeers.map((peer) => {
                const status = getPeerStatus(peer.id, presence, room.clientId);

                return (
                    <button
                        key={peer.id}
                        disabled={!status.valid || !!processingPeerId}
                        onClick={() => sendRequest(peer.id)}
                        className={`peer-card flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-slate-800 text-left ${!status.valid ? 'disabled' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src={peer.avatarUrl} className="w-10 h-10 rounded-full bg-slate-700" />
                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${status.valid ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                            </div>
                            <div>
                                <div className="font-semibold text-sm">{peer.username}</div>
                                <div className="text-xs text-slate-400">{status.label}</div>
                            </div>
                        </div>
                        {status.valid && (
                            <div className="bg-purple-600/20 text-purple-300 text-xs px-2 py-1 rounded font-mono">
                                REQ
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};