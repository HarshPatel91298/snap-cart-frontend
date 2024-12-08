import React from 'react'

export default function Loader() {
    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <div class="animate-spin inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    )
}
