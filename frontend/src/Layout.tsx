import NavBar from "./NavBar"

interface LayoutProps {
    children: JSX.Element
}
const Layout = (props: LayoutProps) => {

    return <>
        <NavBar />
        
        {props.children}
    </>

}

export default Layout