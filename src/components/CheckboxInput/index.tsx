import React, {useState} from "react";

interface SelectInputProps {
    name: string,
    value: number | undefined,
    value_setter: (x: number) => void
    labels: number[],
    label: string
}

function CheckboxInput(props: SelectInputProps) {
    const [checkedBox, setCheckedBox] = useState(0);

    return (
        <div>
            <label>{props.label}</label><br/>
            {props.labels.map((value, index) => (
                <label
                    key={index}
                    className="m-1 font-medium p-1 inline-block pr-1 whitespace-nowrap align-middle"
                ><input
                    id={value.toString()}
                    type={"checkbox"}
                    checked={checkedBox == value}
                    onChange={() => {
                        setCheckedBox(value)
                        props.value_setter(value)
                    }}
                    className="align-middle relative h-4 w-4 m-1 appearance-none rounded-md border-2 border-gray-900 transition-all
                    checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900"
                />{value}</label>
            ))}
        </div>
    )
}

export default CheckboxInput;