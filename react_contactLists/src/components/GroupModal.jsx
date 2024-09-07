import Group from "./Group";

export default function GroupModal({ groups, setGroups,setGroup }) {
    const closeModal = () => {
        const $modalCon = document.getElementById("modalCon");
        $modalCon.classList.remove("add");
    };

    const addGroup = () => {
        const $groupInput = document.getElementById("groupInput");
        const value = $groupInput.value.trim();
        if (value === "") {
            return;
        }

        const newGroups = [...groups, value];
        setGroups(() => newGroups);
        localStorage.setItem("groups", JSON.stringify(newGroups));
        $groupInput.value = "";
        $groupInput.focus();
    };

    const addGroupEnter = (e) => {
        if (e.key === "Enter") {
            addGroup();
        }
    };

    const controlButtons = (e) => {
        if (e.target.tagName === "BUTTON") {
            if(e.target.id === 'closeModal'){
                closeModal();
                return ;
            }
            const idx = e.target.closest("li").dataset.idx;
            const newGroups = groups.filter((_, i) => i !== Number(idx));
            setGroups(() => newGroups);
            localStorage.setItem("groups", JSON.stringify(newGroups));
            setGroup(prev=>newGroups[0]);
            return ;
        }
    };

    return (
        <div className="groupModal" onClick={controlButtons}>
            <h2>그룹 관리</h2>
            <ul className="groups">
                {groups.map((group, i) => (
                    <Group key={i} group={group} idx={i} />
                ))}
            </ul>
            <div className="groupInput">
                <input
                    type="text"
                    placeholder="새 그룹 이름"
                    id="groupInput"
                    onKeyUp={addGroupEnter}
                />
                <button onClick={addGroup}>추가</button>
                <button id="closeModal">닫기</button>
            </div>
        </div>
    );
}
