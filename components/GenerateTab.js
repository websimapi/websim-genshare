window.GenerateTab = ({
    prompt, setPrompt,
    selectedImage, handleFileChange, setSelectedImage,
    resultImage, processingPeerId, statusMsg,
    peers, currentUser, room, sendRequest, presence
}) => {
    const PeerList = window.PeerList;
    const { downloadImage } = window.AppUtils;

    const handleDownload = (e) => {
        e.preventDefault();
        if (!resultImage) return;
        downloadImage(resultImage, 'generated');
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 pb-20 lg:h-full lg:overflow-hidden">
            {/* Result Area - Sticky/Fixed on Desktop */}
            <div className="lg:w-1/2 flex flex-col lg:h-full">
                <div className="bg-black/40 rounded-xl flex items-center justify-center border border-slate-700 overflow-hidden relative group min-h-[300px] lg:h-full lg:max-h-[calc(100vh-140px)]">
                    {resultImage ? (
                        <div className="relative w-full h-full flex items-center justify-center p-2">
                            <img src={resultImage} className="max-w-full max-h-full object-contain shadow-lg" />
                            <button
                                onClick={handleDownload}
                                className="absolute bottom-4 right-4 bg-slate-900/90 hover:bg-purple-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 text-sm font-semibold border border-slate-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                Download
                            </button>
                        </div>
                    ) : (
                        <div className="text-slate-500 text-center p-4">
                            {processingPeerId ? (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="loader"></div>
                                    <span className="text-sm animate-pulse">{statusMsg}</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl mb-2">🎨</span>
                                    <span>Image will appear here</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Inputs & Controls - Scrollable on Desktop */}
            <div className="lg:w-1/2 flex flex-col gap-4 lg:overflow-y-auto lg:pr-2 scroll-container">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3 shadow-sm">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your image..."
                        className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-purple-500 outline-none resize-none h-24 transition-all focus:ring-1 focus:ring-purple-500"
                        disabled={!!processingPeerId}
                    />

                    <div className="flex items-center gap-2">
                        <label className="flex-1 bg-slate-900 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm py-2 px-4 rounded cursor-pointer transition-all flex items-center justify-center gap-2 active:scale-95">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            <span>{selectedImage ? "Change Image" : "Upload Img2Img (Optional)"}</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={!!processingPeerId}
                            />
                        </label>
                        {selectedImage && (
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="bg-red-900/50 hover:bg-red-900 text-red-200 p-2 rounded border border-red-800 transition-colors"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    {selectedImage && (
                        <div className="text-xs text-green-400 text-center truncate px-2 bg-green-900/20 py-1 rounded border border-green-900/30">
                            Attached: {selectedImage.name}
                        </div>
                    )}
                </div>

                {/* Peer Selector */}
                <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                        <span>Select Processor</span>
                        <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded border border-purple-800">100 Credits</span>
                    </h3>
                    <PeerList 
                        peers={peers}
                        currentUser={currentUser}
                        room={room}
                        presence={presence}
                        processingPeerId={processingPeerId}
                        sendRequest={sendRequest}
                    />
                </div>
            </div>
        </div>
    );
};