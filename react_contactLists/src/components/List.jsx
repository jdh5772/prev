export default function List({content,idx}) {
    return (
        <li className="list" data-id={idx}>
            <p>{content}</p>
            <button id="detail">세부사항</button>
            <button id="delete">삭제</button>
        </li>
    );
}
