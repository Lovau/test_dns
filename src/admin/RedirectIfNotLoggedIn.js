import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { userService } from "services/UserService";

function RedirectIfNotLoggedIn() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    let history = useHistory();

    useEffect(() => {
        const subscription = userService.user.subscribe((x) => {
            setUser(x);
            setLoading(false);
        });
        return () => subscription.unsubscribe();
    }, []);

    if (!loading && !user) {
        history.push("/");
    }

    return <></>;
}

export { RedirectIfNotLoggedIn };
