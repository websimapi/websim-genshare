window.GalleryTab = ({ room }) => {
    const [images, setImages] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedItem, setSelectedItem] = React.useState(null);
    
    const { downloadImage } = window.AppUtils;

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
            {/* Detail Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedItem(null)}>
                    {/* Fixed container to prevent button from scrolling away */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
                        
                        {/* Always-visible Close Button */}
                        <button 
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-3 right-3 z-20 bg-black/60 hover:bg-red-900/80 text-white p-2 rounded-full backdrop-blur-md transition-colors border border-white/10 shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        
                        {/* Scrollable Body */}
                        <div className="overflow-y-auto scroll-container flex-1">
                            <div className="relative bg-black/50 min-h-[200px] flex items-center justify-center p-4">
                                <img src={selectedItem.url} className="w-full h-auto object-contain max-h-[40vh] rounded shadow-lg" />
                            </div>
                            
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-start gap-4 pr-8">
                                    <div>
                                        <h3 className="font-bold text-lg text-white leading-tight">Creation Details</h3>
                                        <p className="text-xs text-slate-400">{new Date(selectedItem.timestamp).toLocaleString()}</p>
                                    </div>
                                    <button 
                                        onClick={() => downloadImage(selectedItem.url, 'genshare')}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-lg shadow-purple-900/20 whitespace-nowrap"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                        Save
                                    </button>
                                </div>

                                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                    <label className="text-[10px] uppercase text-purple-400 font-bold mb-1 block tracking-wider">Prompt</label>
                                    <p className="text-sm text-slate-200 leading-snug font-light max-h-32 overflow-y-auto">{selectedItem.prompt}</p>
                                </div>

                                {selectedItem.source_image && (
                                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 flex gap-3 items-center">
                                        <img src={selectedItem.source_image} className="w-12 h-12 object-cover rounded border border-slate-600 bg-slate-800" />
                                        <div className="text-xs text-slate-400 flex-1">
                                            <span className="block text-purple-400 font-bold text-[10px] uppercase">Source Image</span>
                                            Used as reference (Img2Img)
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-3">
                                    <div className="bg-slate-800/30 p-2 rounded">
                                        <span className="text-slate-500 block text-[10px] uppercase mb-0.5">Processor</span>
                                        <span className="text-slate-200 text-sm font-medium flex items-center gap-1.5 truncate">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></div>
                                            {selectedItem.processor}
                                        </span>
                                    </div>
                                    <div className="bg-slate-800/30 p-2 rounded">
                                        <span className="text-slate-500 block text-[10px] uppercase mb-0.5">Requested By</span>
                                        <span className="text-slate-200 text-sm font-medium flex items-center gap-1.5 truncate">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                                            {selectedItem.requester}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                        <div 
                            key={img.id} 
                            onClick={() => setSelectedItem(img)}
                            className="relative group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg aspect-square cursor-pointer active:scale-95 transition-all"
                        >
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                downloadImage(img.url, img.prompt);
                                            }}
                                            className="bg-white/10 hover:bg-purple-600 p-1.5 rounded text-white transition-colors"
                                            title="Download"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                        </button>
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