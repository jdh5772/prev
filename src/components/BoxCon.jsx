import Form from './Form';
import ListCon from './ListCon';
import { useState } from 'react';

export default function BoxCon({groups,group,setGroup}) {
    const data = JSON.parse(localStorage.getItem('contactList')) || [];
    const [lists,setLists] = useState(data);

    return (
        <div className="boxCon">
            <Form setLists={setLists} lists={lists} groups={groups} group={group} setGroup={setGroup}/>
            <ListCon lists={lists} setLists={setLists} data={data}/>
        </div>
    );
}
