import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { Login } from "admin/Login";
import { Logout } from "admin/Logout";
import { userService } from "services/UserService";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscription = userService.user.subscribe((x) => setUser(x));
    return () => subscription.unsubscribe();
  }, []);

  // <Nav className="ml-auto">
  return (
    <Navbar expand="lg" variant="dark" bg="dark">
      <Navbar.Brand as={Link} to="/">
        Rolex - URLs verification tool
      </Navbar.Brand>
      <Navbar.Collapse className="justify-content-center">
        <Nav>
          {user && (
            <>
              <Nav.Link as={Link} className="link" to="/admin">
                Admin
              </Nav.Link>
              <Nav.Link as={Link} className="link" to="/admin/domain/add">
                Add a new domain
              </Nav.Link>
            </>
          )}
        </Nav>
        <Nav className="userLinks">
          {user && (
            <>
              <Nav.Link as={Link} className="link" to={`/admin/users/${user.uuid}`}>
                Edit user
              </Nav.Link>
              <Nav.Link as={Link} className="link" to={`/admin/users`}>
                Users management
              </Nav.Link>
              <Logout />
            </>
          )}
          {!user && <Login />}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
