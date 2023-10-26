import { useAudioEditor } from "@/app/context/AudioEditorContext";

const ErrorLoadingAudioDialog = () => {
    const { errorLoadingPrincipalBuffer, closeErrorLoadingPrincipalBuffer } = useAudioEditor();

    return (
        <>
            <input type="checkbox" id="errorLoadingAudioDialog" className="modal-toggle" checked={errorLoadingPrincipalBuffer} readOnly />
            <dialog className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Erreur lors de l&apos;ouverture du fichier</h3>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => closeErrorLoadingPrincipalBuffer()}>✕</button>
                    </form>
                    <div className="flex flex-col">
                        <div className="mt-3">
                            <p className="py-4 flex items-center gap-x-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 stroke-red-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Assurez-vous que le fichier que vous avez sélectionné soit bien un fichier audio correct, puis réessayez.</span>
                            </p>
                        </div>
                    </div>
                    <div className="modal-action mt-0">
                        <form method="dialog">
                            <button className="btn" onClick={() => closeErrorLoadingPrincipalBuffer()}>OK</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default ErrorLoadingAudioDialog;