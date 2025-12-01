// Utility functions for the GenShare app

window.AppUtils = {
    /**
     * Log a completed job to the database
     */
    logJobToDatabase: async (room, reqData, resultUrl) => {
        const collection = room.collection('processor_stats_v1');
        
        // Get current user to ensure we find OUR record
        const currentUser = await window.websim.getCurrentUser();

        // Find existing record by username to ensure one row per user
        const records = await collection.filter({ username: currentUser.username }).getList();

        const jobLog = {
            timestamp: new Date().toISOString(),
            requested_by: reqData.senderName,
            result_url: resultUrl,
            cost: 100,
            prompt: reqData.prompt // Added prompt to log for Gallery
        };

        if (records.length > 0) {
            const record = records[0];
            let logs = [];
            try {
                // Handle legacy data or stringified json
                logs = record.logs ? (typeof record.logs === 'string' ? JSON.parse(record.logs) : record.logs) : [];
                if (!Array.isArray(logs)) logs = [];
            } catch (e) { logs = [] }

            logs.push(jobLog);

            await collection.update(record.id, {
                logs: JSON.stringify(logs),
                total_processed: (record.total_processed || 0) + 1
            });
        } else {
            // Create new single row for this user if it doesn't exist
            await collection.create({
                logs: JSON.stringify([jobLog]),
                total_processed: 1
            });
        }
    },

    /**
     * Determine the status label and validity for a peer
     */
    getPeerStatus: (pid, presence, roomClientId) => {
        const p = presence[pid] || {};
        const isMe = pid === roomClientId;
        
        if (p.status === 'generating') return { label: isMe ? "Busy (Generating)" : "Busy", valid: false };
        if (p.accepting === false) return { label: isMe ? "Maxed Out" : "Maxed Out", valid: false };
        
        return { label: isMe ? "(You) Available" : "Available", valid: true };
    }
};