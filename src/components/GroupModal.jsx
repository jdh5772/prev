export default function GroupModal() {
    return (
        <div className="groupModal">
            <h2>그룹 관리</h2>
            <ul className="groups">
                <li className="group">
                    <p>가족</p>
                    <button>X</button>
                </li>
                <li className="group">
                    <p>가족</p>
                    <button>X</button>
                </li>
                <li className="group">
                    <p>가족</p>
                    <button>X</button>
                </li>
            </ul>
            <div className="groupInput">
                <input type="text" placeholder="새 그룹 이름" />
                <button>추가</button>
                <button>닫기</button>
            </div>
        </div>
    );
}
