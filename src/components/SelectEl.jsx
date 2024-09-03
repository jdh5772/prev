import Option from './Option';

export default function SelectEl({setGroup,groups}) {
    const selectGroup = e=>{
        setGroup(()=>e.target.value);
    }

    const addGroup = e=>{
        e.preventDefault();
        const $modalCon = document.getElementById('modalCon');
        $modalCon.classList.add('add');
    }

    return (
        <div className="selectEl">
            <label>그룹</label>
            <select name="group" onChange={selectGroup}>
                {groups.map((group, i) => (
                    <Option key={i} group={group} idx={i}/>
                ))}
            </select>
            <button onClick={addGroup}>조직추가</button>
        </div>
    );
}
