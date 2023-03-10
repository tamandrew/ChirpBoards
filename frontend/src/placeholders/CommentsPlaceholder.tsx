import SpinningCircle from "../SpinningCircle"

interface CommentsPlaceholderProps {
    opacity: string,
    showNoComments?: boolean,
    showSpinning?: boolean
}
const CommentsPlaceholder = (props: CommentsPlaceholderProps) => {
    
    return (
        <div style = {{opacity: props.opacity}}
            className = "w-[95%] mx-[2.5%] my-6 h-24 rounded-bl-xl border border-black/10 rounded-tr-xl bg-black/20 shadow-md flex justify-center items-center">
            {props.showNoComments ?
                <div className = "w-fit h-fit text-white/50 text-xl select-none flex">
                    No Comments Yet
                </div>
            : null}
            {props.showSpinning ?
                <SpinningCircle />
            : null}
        </div>
    )
}


export default CommentsPlaceholder