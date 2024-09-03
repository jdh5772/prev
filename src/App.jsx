import "./App.css";
import BoxCon from "./components/BoxCon";
import ModalCon from "./components/ModalCon";

function App() {
    const groups = JSON.parse(localStorage.getItem("groups")) || [
        "가족",
        "친구",
        "직장",
        "스터디",
    ];
    return (
        <main>
            <h1>연락처 리스트</h1>
            <BoxCon groups={groups}/>
            <ModalCon />
        </main>
    );
}

export default App;
