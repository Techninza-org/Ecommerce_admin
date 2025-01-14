import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";

export const isAuthenticated = () => {
    const token = Cookie.get("token");
    return token ? true : false;
};

export const removeToken = () => {
    Cookie.remove("token");
};