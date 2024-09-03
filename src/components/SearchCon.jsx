export default function SearchCon({ setLists ,data}) {
    const searchData = (e) => {
        const $input = document.getElementById('searchInput');
        if (e.key === "Enter") {
            const inputValue = $input.value;
            const newLists = [...data].filter((list) => 
                list.name.includes(inputValue) ||
                    list.tel.includes(inputValue) ||
                    list.group.includes(inputValue)
            );
            setLists(()=>newLists);
            $input.value = '';
            $input.focus();
        }
    };

    const showAllLists = ()=>{
        setLists(()=>[...data]);
    }
    return (
        <div className="searchCon">
            <input
                type="text"
                placeholder="검색어를 입력 후 엔터를 누르세요"
                onKeyUp={searchData}
                id="searchInput"
            />
            <button onClick={showAllLists}>전체리스트 보기</button>
        </div>
    );
}
