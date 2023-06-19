import Footer from "./footer";
import Navbar from "./navbar";


const Layout = ({ children }) => {
    return (
        <div>
            <Navbar/>
            <div>{children}</div>
            <Footer/>
        </div>
    );
}

export default Layout;
