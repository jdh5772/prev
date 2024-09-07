import { useState } from "react";
import InputEl from "./InputEl";
import SelectEl from "./selectEl";

export default function Form({setLists,lists,groups,group,setGroup}) {
    const [name,setName] = useState(null);
    const [tel,setTel] = useState(null);
    const [content,setContent] = useState(null);

    const addData = e=>{
        const data = {name,tel,group,content};
        const $form = document.getElementById('form');
        const $nameInput = document.getElementById('name');
        e.preventDefault();
        if(!name || !tel){
            return ;
        }
        const newLists = [data,...lists];
        setLists(prev=>newLists);
        localStorage.setItem('contactList',JSON.stringify(newLists));
        $form.reset();
        $nameInput.focus();
    }


    return (
        <form id="form">
            <InputEl category={"name"} setData={setName} id={"name"}/>
            <InputEl category={"tel"} setData={setTel}/>
            <SelectEl setGroup={setGroup} groups={groups}/>
            <InputEl category={"content"} setData={setContent}/>
            <button onClick={addData}>저장</button>
        </form>
    );
}
