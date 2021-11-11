import React from "react";
import { Navbar, Nav } from "react-bootstrap";

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Helper from "./Helper";

const Header = () => {
  //assigning location variable
  const location = useLocation();
  var isAdmin = false;
  if (Helper.isAdmin(location)) {
    isAdmin = true;
    console.log("isAdmin");
  }

  // <Nav.Link as={Link} className="link" to="/isadmin">Admin</Nav.Link>
  return (
    <Navbar expand="lg" variant="dark" bg="dark">
      <Navbar.Brand as={Link} to="/">
        Rolex - URLs verification tool
      </Navbar.Brand>
      <Navbar.Collapse>
        <Nav>
          {isAdmin && (
            <>
              <Nav.Link as={Link} className="link" to="/isadmin">
                Admin
              </Nav.Link>
              <Nav.Link as={Link} className="link" to="/isadmin/add">
                Add
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
