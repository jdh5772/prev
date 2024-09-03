import Form from './Form';
import ListCon from './ListCon';
import { useState } from 'react';

export default function BoxCon({groups}) {
    const data = JSON.parse(localStorage.getItem('contactList')) || [];
    const [lists,setLists] = useState(data);

    return (
        <div className="boxCon">
            <Form setLists={setLists} lists={lists} groups={groups}/>
            <ListCon lists={lists} setLists={setLists} data={data}/>
        </div>
    );
}
