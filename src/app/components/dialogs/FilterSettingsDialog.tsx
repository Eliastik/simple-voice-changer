import Filter from "@/app/model/Filter";
import FilterSettingsForm from "../audioEditor/FilterSettingsForm";

const FilterSettingsDialog = ({
    filter
}: { filter: Filter }) => {
    return (
        <dialog id={`modalSettings_${filter.filterId}`} className="modal">
            <FilterSettingsForm filterId={filter.filterId} settingsModalTitle={filter.settingsModalTitle} settingsForm={filter.settingsForm} firstColumnStyle={filter.firstColumnStyle} secondColumnStyle={filter.secondColumStyle}></FilterSettingsForm>
        </dialog>
    );
};

export default FilterSettingsDialog;