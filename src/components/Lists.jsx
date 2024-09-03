import List from "./List";

export default function Lists({ lists, setLists }) {
    const showDetail = () => {};

    const deleteData = (idx) => {
        const newLists = lists.filter((_, i) => i !== Number(idx));
        setLists(() => newLists);
        localStorage.setItem('contactList',JSON.stringify(newLists));
    };

    const handleButtonClick = (e) => {
        if (e.target.tagName !== "BUTTON") {
            return;
        }

        if (e.target.id === "detail") {
            showDetail();
        }

        if (e.target.id === "delete") {
            const idx = e.target.closest("Li").dataset.id;
            deleteData(idx);
        }
    };
    
    return (
        <ul className="lists" onClick={handleButtonClick}>
            {lists.map((list, i) => (
                <List
                    key={i}
                    content={`${list.name} ${list.tel} ${list.group}`}
                    idx={i}
                />
            ))}
        </ul>
    );
}
