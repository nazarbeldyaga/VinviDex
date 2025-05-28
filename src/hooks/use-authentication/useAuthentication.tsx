import { useEffect } from "react";

const useAuthentication = () => {
    let isLoggedIn: boolean = false;
    useEffect(() => {
        isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    }, []);

    return {
        isLoggedIn
    };
};

export default useAuthentication;
