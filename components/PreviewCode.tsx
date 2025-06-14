"use client"

export default function PreviewCode({ url }: {url:string} ) {
    return (
        <div className="h-[calc(100vh-12rem)] w-full max-w-[1200px] mx-auto rounded-lg overflow-hidden border border-[#30363d] bg-[#141414]">
            {!url ? (
                <div className="h-full w-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <p className="text-gray-400 text-sm">We are installing dependencies...</p>
                        {/* <p className="text-gray-400 text-sm">After this you will be able to see preview</p> */}
                        <p className="text-gray-400 text-sm">No worries — this is a one-time setup.</p>
                        <p className="text-gray-400 text-sm">Things will run smoothly once it's done.</p>
                    </div>
                </div>
            ) : (
                <iframe className="h-full w-full" src={url}></iframe>
            )}
        </div>
    )
}