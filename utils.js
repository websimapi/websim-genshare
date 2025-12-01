// Utility functions for the GenShare app

window.AppUtils = {
    /**
     * Log a completed job to the database
     */
    logJobToDatabase: async (room, reqData, resultUrl) => {
        const collection = room.collection('processor_stats_v1');
        
        // Find existing record for this user (created_by is automatic filter usually, but we be explicit)
        const records = await collection.filter({ created_by: true }).getList();

        const jobLog = {
            timestamp: new Date().toISOString(),
            requested_by: reqData.senderName,
            result_url: resultUrl,
            cost: 100
        };

        if (records.length > 0) {
            const record = records[0];
            let logs = [];
            try {
                logs = record.logs ? (typeof record.logs === 'string' ? JSON.parse(record.logs) : record.logs) : [];
            } catch (e) { logs = [] }

            logs.push(jobLog);

            await collection.update(record.id, {
                logs: JSON.stringify(logs),
                total_processed: (record.total_processed || 0) + 1
            });
        } else {
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