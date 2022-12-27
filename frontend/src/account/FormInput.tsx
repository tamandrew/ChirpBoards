import { useState } from "react"

interface FormInputProps {
    name: string
    placeholder?: string
    value: string
    setValue: (value: string) => void
    password?: boolean
    mt?: string
}

function FormInput(props: FormInputProps) {
    const [highlightLabel, setHighlightLabel] = useState(false);
    
    return (
    <div className = {`mt-${props.mt ? props.mt : "2"}`}>

        <input 
            value = {props.value}
            onChange = {(e) => props.setValue(e.target.value)}
            type = {props.password ? "password" : "text"}
            placeholder = {props.placeholder} 

            onFocus = {() => setHighlightLabel(true)}
            onBlur = {() => setHighlightLabel(false)}
            className = {`text-white block p-1 w-64 bg-transparent border-b border-b-white focus:outline-none`} />


        <label className = {`text-xs ml-1 text-white${highlightLabel ? "/90" : "/50"}`}>{props.name}</label>

    </div>
    )
}


export default FormInput;