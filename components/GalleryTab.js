window.GalleryTab = ({ room }) => {
    const [images, setImages] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const downloadImage = async (e, url, prompt) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `genshare-${prompt.slice(0, 15).replace(/[^a-z0-9]/gi, '_')}-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        } catch (err) {
            console.error("Download failed", err);
            window.open(url, '_blank');
        }
    };

    React.useEffect(() => {
        const fetchGallery = async () => {
            try {
                // Fetch all processor stats
                const records = await room.collection('processor_stats_v1').getList();
                
                let allImages = [];

                records.forEach(record => {
                    if (!record.logs) return;
                    
                    let logs = [];
                    try {
                        logs = typeof record.logs === 'string' ? JSON.parse(record.logs) : record.logs;
                    } catch (e) {
                        console.error("Error parsing logs", e);
                    }

                    if (Array.isArray(logs)) {
                        logs.forEach(log => {
                            if (log.result_url) {
                                allImages.push({
                                    id: record.id + '_' + log.timestamp + '_' + Math.random().toString(36).substr(2, 5),
                                    url: log.result_url,
                                    processor: record.username,
                                    requester: log.requested_by,
                                    timestamp: new Date(log.timestamp),
                                    prompt: log.prompt || "No prompt recorded",
                                    source_image: log.source_image_url
                                });
                            }
                        });
                    }
                });

                // Sort by newest first
                allImages.sort((a, b) => b.timestamp - a.timestamp);
                setImages(allImages);
            } catch (e) {
                console.error("Gallery fetch error:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, [room]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
            <div className="loader"></div>
            <div>Loading Gallery...</div>
        </div>
    );

    return (
        <div className="space-y-4 animate-fade-in pb-20">
            <h2 className="text-lg font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Community Creations
            </h2>
            {images.length === 0 ? (
                <div className="text-center text-slate-500 py-10 border-2 border-dashed border-slate-800 rounded-xl">
                    No images generated yet!<br/>
                    <span className="text-sm">Be the first to create something.</span>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {images.map((img) => (
                        <div key={img.id} className="relative group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg aspect-square">
                            <img 
                                src={img.url} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                loading="lazy" 
                                alt={img.prompt}
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 flex flex-col justify-end">
                                <p className="text-xs text-white line-clamp-2 mb-2 italic">
                                    "{img.prompt}"
                                </p>
                                
                                <div className="flex justify-between items-center border-t border-white/10 pt-2 mt-1">
                                    <div className="flex flex-col text-[10px] text-slate-300">
                                        <span>By: <span className="text-purple-400 font-bold">{img.processor}</span></span>
                                    </div>
                                    <div className="flex gap-1">
                                         <button 
                                            onClick={(e) => downloadImage(e, img.url, img.prompt)}
                                            className="bg-white/10 hover:bg-purple-600 p-1.5 rounded text-white transition-colors"
                                            title="Download"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                        </button>
                                        <a 
                                            href={img.url} 
                                            target="_blank" 
                                            className="bg-white/10 hover:bg-white/20 p-1.5 rounded text-white transition-colors"
                                            title="Open full size"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};