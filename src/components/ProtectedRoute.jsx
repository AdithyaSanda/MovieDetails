import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function ProtectedRoute({children}) {
    const {session} = useAuth()

    if(session === undefined) {
        return <div>Loading ...</div>
    }

    return session ? <>{children}</> : <Navigate to="/signin" replace/>
}