import Cookie from "js-cookie";

export const isAuthenticated = () => {
    const token = Cookie.get("token");
    return token ? true : false;
};