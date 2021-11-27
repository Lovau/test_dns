import { userService } from "services/UserService";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";

export { Logout };

function Logout() {
  let history = useHistory();

  function logout() {
    userService.logout();
    history.push("/");
  }

  return (
    <Button className="btn-nav" onClick={logout}>
      Logout
    </Button>
  );
}
