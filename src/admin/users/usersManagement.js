import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "components/Spinner";
import { Alert } from "components/Alert";
import { alertService } from "services/AlertService";
import { userService } from "services/UserService";
import { RedirectIfNotLoggedIn } from "admin/RedirectIfNotLoggedIn";

export default usersManagement;

/**
 * From: https://jasonwatmore.com/post/2021/08/19/next-js-11-user-registration-and-login-tutorial-with-example-app
 *
 * The users index page displays a list of all users in the Next.js tutorial app and contains buttons for adding,
 * editing and deleting users.
 *
 * A useEffect hook is used to get all users from the user service and store them in local state by calling setUsers().
 *
 * The delete button calls the deleteUser() function which first updates the user is local state with
 * an isDeleting = true property so the UI displays a spinner on the delete button, it then calls userService.delete() to
 * delete the user from the Next.js api, then removes the deleted user from local state to remove it from the UI.
 *
 * More information on https://jasonwatmore.com/post/2020/04/11/react-hooks-bootstrap-alert-notifications
 */
function usersManagement() {
  const [users, setUsers] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService.getAll().then((x) => setUsers(x));

    const subscription = userService.user.subscribe((x) => setUser(x));
    return () => subscription.unsubscribe();
  }, []);

  function deleteUser(uuid) {
    if (user.uuid === uuid) {
      alertService.error("You can't delete your own user.");
      return;
    }

    setUsers(
      users.map((x) => {
        if (x.uuid === uuid) {
          x.isDeleting = true;
        }
        return x;
      })
    );
    userService.delete(uuid).then(() => {
      setUsers((users) => users.filter((x) => x.uuid !== uuid));
    });
  }

  return (
    <>
      <RedirectIfNotLoggedIn />
      <h2>Users</h2>
      <Alert />
      <Link to="/admin/user/add" className="btn btn-sm btn-success mb-2">
        Add User
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: "30%" }}>First Name</th>
            <th style={{ width: "30%" }}>Last Name</th>
            <th style={{ width: "30%" }}>Username</th>
            <th style={{ width: "10%" }}></th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.length > 0 &&
            users.map((user) => (
              <tr key={user.uuid}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.username}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <Link to={`/admin/users/${user.uuid}`} className="btn btn-sm btn-primary mr-3">
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteUser(user.uuid)}
                    className="btn btn-sm btn-danger btn-delete-user"
                    disabled={user.isDeleting}
                  >
                    {user.isDeleting ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <span>Delete</span>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          {!users && (
            <tr>
              <td colSpan="4">
                <Spinner />
              </td>
            </tr>
          )}
          {users && !users.length && (
            <tr>
              <td colSpan="4" className="text-center">
                <div className="p-2">No Users To Display</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
