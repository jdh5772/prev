import Option from './Option';

export default function SelectEl({setGroup,groups}) {
    const selectGroup = e=>{
        setGroup(()=>e.target.value);
    }

    return (
        <div className="selectEl">
            <label>그룹</label>
            <select name="group" onChange={selectGroup}>
                {groups.map((group, i) => (
                    <Option key={i} group={group} />
                ))}
            </select>
            <button>조직추가</button>
        </div>
    );
}
