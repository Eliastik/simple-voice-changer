import { useApplicationConfig } from "@/app/context/ApplicationConfigContext";

const AppConfigDialog = () => {
  const { currentThemeValue, setTheme } = useApplicationConfig();

  return (
    <dialog id="modalSettings" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Paramètres de l&apos;application</h3>
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div className="flex flex-col">
          <div className="mt-3">
            <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
              <div className="md:w-4/6">
                <label htmlFor="colorTheme">Thème de couleurs :</label>
              </div>
              <select className="select select-bordered md:w-4/6"id="colorTheme" value={currentThemeValue} onChange={e => setTheme(e.target.value)}>
                <option value="auto">Thème de l&apos;appareil</option>
                <option value="light">Thème clair</option>
                <option value="dark">Thème sombre</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Fermer</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default AppConfigDialog;