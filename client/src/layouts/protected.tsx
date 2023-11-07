import { Navigate, Outlet } from "react-router-dom";

export const ProtoctedLayout = (): JSX.Element => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/auth/login" />
    return (
        <Outlet />
    )
}

export default ProtoctedLayout;