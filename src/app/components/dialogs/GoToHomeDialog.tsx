import { useAudioEditor } from "@/app/context/AudioEditorContext";

const GoToHomeDialog = () => {
    const { exitAudioEditor } = useAudioEditor();

    return (
        <dialog id="modalGoToHome" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Retourner à l&apos;accueil</h3>
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <p className="py-4">Êtes-vous sûr de vouloir quitter et retourner à l&apos;accueil de l&apos;application ? Vous perdrez toutes vos modifications non enregistrées.</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-neutral mr-2" onClick={() => exitAudioEditor()}>OK</button>
                        <button className="btn">Annuler</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default GoToHomeDialog;