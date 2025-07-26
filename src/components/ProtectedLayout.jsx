import ProtectedRoute from "./ProtectedRoute";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function ProtectedLayout(props) {
    return(
        <ProtectedRoute>
            <>
                <Header {...props}/>
                <Outlet />  
            </>
        </ProtectedRoute>
    )
}