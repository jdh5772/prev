import { useState } from "react";
import "./App.css";
import BoxCon from "./components/BoxCon";
import ModalCon from "./components/ModalCon";

function App() {
    const data = JSON.parse(localStorage.getItem("groups")) || [
        "가족",
        "친구",
        "직장",
        "스터디",
    ];
    const [groups,setGroups] = useState(data);
    const [group,setGroup] = useState(groups[0]);
    return (
        <main>
            <h1>연락처 리스트</h1>
            <BoxCon groups={groups} group={group} setGroup={setGroup}/>
            <ModalCon groups={groups} setGroups={setGroups} setGroup={setGroup}/>
        </main>
    );
}

export default App;
