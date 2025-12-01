window.GenerateTab = ({
    prompt, setPrompt,
    selectedImage, handleFileChange, setSelectedImage,
    resultImage, processingPeerId, statusMsg,
    peers, currentUser, room, sendRequest, presence
}) => {
    const PeerList = window.PeerList;

    return (
        <div className="space-y-4 pb-20">
            {/* Result Area */}
            <div className="min-h-[200px] bg-black/40 rounded-xl flex items-center justify-center border border-slate-700 overflow-hidden relative group">
                {resultImage ? (
                    <div className="relative w-full h-full">
                        <img src={resultImage} className="w-full h-auto object-contain max-h-[400px]" />
                        <a
                            href={resultImage}
                            download="generated.png"
                            className="absolute bottom-2 right-2 bg-slate-900/80 p-2 rounded text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Download
                        </a>
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

            {/* Inputs */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your image..."
                    className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-purple-500 outline-none resize-none h-24"
                    disabled={!!processingPeerId}
                />

                <div className="flex items-center gap-2">
                    <label className="flex-1 bg-slate-900 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm py-2 px-4 rounded cursor-pointer transition-colors flex items-center justify-center gap-2">
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
                            className="bg-red-900/50 hover:bg-red-900 text-red-200 p-2 rounded border border-red-800"
                        >
                            ✕
                        </button>
                    )}
                </div>
                {selectedImage && (
                    <div className="text-xs text-green-400 text-center truncate px-2">
                        {selectedImage.name}
                    </div>
                )}
            </div>

            {/* Peer Selector */}
            <div>
                <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Select Processor (100 Cr)</h3>
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
    );
};