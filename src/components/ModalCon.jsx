import GroupModal from "./GroupModal";

export default function ModalCon({groups,setGroups,setGroup}) {
    return (
        <div className="modalCon" id="modalCon">
            <GroupModal groups={groups} setGroups={setGroups} setGroup={setGroup}/>
        </div>
    );
}
