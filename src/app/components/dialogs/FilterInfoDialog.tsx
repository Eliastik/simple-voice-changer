import Filter from "@/app/model/Filter";
import { useTranslation } from "react-i18next";

const FilterInfoDialog = ({
    filter
}: { filter: Filter }) => {
    const { t } = useTranslation();

    return (
        <dialog id={`modalInfos_${filter.filterId}`} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{t("dialogs.filterInformations.title")}</h3>
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <p className="py-4">{t(filter.info)}</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">{t("ok")}</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default FilterInfoDialog;