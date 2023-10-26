import Filter from "@/app/model/Filter";

const FilterInfoDialog = ({
    filter
}: { filter: Filter }) => {
    return (
        <dialog id="modalGoToHome" className="modal">
            <dialog id={`modalInfos_${filter.filterId}`} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Informations sur le filtre</h3>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <p className="py-4">{filter.info}</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">OK</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </dialog>
    );
};

export default FilterInfoDialog;