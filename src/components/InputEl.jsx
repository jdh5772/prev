import { useState } from "react";

export default function InputEl({ category, setData ,id}) {
    const [isError, setIsError] = useState(false);
    const setTitle = () => {
        if (category === "name") {
            return "이름";
        }

        if (category === "tel") {
            return "전화번호";
        }

        if (category === "content") {
            return "간단한기록";
        }
    };

    const regex = {
        name: {
            reg: /^[가-힣]{2,}$/,
            message: "이름은 한글로 두 글자 이상 입력해주세요.",
        },
        tel: {
            reg: /^010-\d{4}-\d{4}$/,
            message: "전화번호는 010-0000-0000형식으로 입력해주세요.",
        },
    };

    const errMessage = (e) => {
        const value = e.target.value;
        if(category==='content'){
            setData(()=>value);
            return ;
        }

        if (regex[category] && regex[category].reg.test(value)) {
            setIsError(() => false);
            setData(() => value);
        } else {
            setIsError(() => true);
        }
        return ;
    };

    return (
        <div className="inputEl">
            <div>
                <label>{setTitle()}</label>
                <input
                    type="text"
                    placeholder={setTitle()}
                    onChange={errMessage}
                    id={id}
                />
            </div>
            {regex[category] && isError ? <p>{regex[category].message}</p> : ""}
        </div>
    );
}
