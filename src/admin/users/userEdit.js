import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AddEdit } from "admin/users/AddEdit";
import { userService } from "services/UserService";
import { alertService } from "services/AlertService";
import { RedirectIfNotLoggedIn } from "admin/RedirectIfNotLoggedIn";
import { Spinner } from "components/Spinner";

export default userEdit;
//TODO : get ride of this component
function userEdit() {
  const [user, setUser] = useState(null);
  const { userid } = useParams();

  useEffect(() => {
    userService
      .getById(userid)
      .then((x) => {
        setUser(x);
      })
      .catch(alertService.error);
  }, []);

  return (
    <>
      <RedirectIfNotLoggedIn />
      {user ? <AddEdit user={user} /> : <Spinner />}
    </>
  );
}
