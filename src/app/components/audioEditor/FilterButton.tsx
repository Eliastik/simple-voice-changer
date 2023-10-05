"use client";

import { useAudioEditor } from "@/app/context/AudioEditorContext";

const FilterButton = ({
    filterId,
    filterName,
    filterIcon,
    enabled = true,
    hasSettings = true
}: { filterId: string, filterName: string, filterIcon: JSX.Element, enabled: boolean, hasSettings: boolean }) => {
    //const { enableFilter } = useAudioEditor();

    return (
        <>
            <div className="join join-vertical w-36">
                <button className={`btn flex-col w-full h-36 gap-8 rounded-b-none border-0 ${enabled ? "bg-blue-200 hover:bg-blue-300" : ""}`} /*onClick={() => enableFilter(filterId)}*/>
                    <div>
                        {filterIcon}
                    </div>
                    <div>{filterName}</div>
                </button>
                <div className="flex join">
                    {hasSettings && <button className={`btn flex-grow p-0 flex-col border-l-0 border-b-0 h-1 border-t-1 rounded-t-none rounded-br-none ${enabled ? "bg-blue-200 hover:bg-blue-300 border-t-blue-300 border-r-blue-300 hover:border-t-blue-300 hover:border-r-blue-300" : "border-t-gray-300 border-r-gray-300 hover:border-t-gray-300 hover:border-r-gray-300"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>}
                    <button className={`btn flex-grow p-0 flex-col h-1 border-b-0 border-r-0 border-t-1 rounded-t-none ${enabled ? "bg-blue-200 hover:bg-blue-300 border-t-blue-300 border-l-blue-300 hover:border-t-blue-300 hover:border-l-blue-300" : "border-t-gray-300 border-l-gray-300 hover:border-t-gray-300 hover:border-l-gray-300"} ${hasSettings ? "rounded-bl-none" : "border-l-0"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    )
};

export default FilterButton;