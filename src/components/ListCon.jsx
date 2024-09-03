import Lists from "./Lists";
import SearchCon from "./SearchCon";

export default function ListCon({lists,setLists,data}) {
    return (
        <div className="listCon">
            <SearchCon setLists={setLists} data={data}/>
            <Lists lists={lists} setLists={setLists}/>
        </div>
    );
}
