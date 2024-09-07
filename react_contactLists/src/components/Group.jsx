export default function Group({group,idx}) {
    return (
        <li className="group" data-idx={idx}>
            <p>{group}</p>
            <button>X</button>
        </li>
    );
}
