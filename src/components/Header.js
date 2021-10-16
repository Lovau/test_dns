import React from "react";
import { Navbar, Nav} from 'react-bootstrap';

import { Link} from 'react-router-dom'
import { useLocation } from "react-router-dom";

const Header = () => {
    //assigning location variable
    const location = useLocation();

    //destructuring pathname from location
    const { pathname } = location;

    const isAdmin = function(splitLocation) {
      if (splitLocation[1] === "admin") {
        return true;
      }
      return false;
    };

    //Javascript split method to get the name of the path in array
    const splitLocation = pathname.split("/");

    if (isAdmin(splitLocation)) {
      console.log("isAdmin");
    }

    return (
      <Navbar expand="lg" variant="dark" bg="dark">
        <Navbar.Brand as={Link} to='/'>Rolex - URLs verification tool</Navbar.Brand>
        <Navbar.Collapse>
          <Nav>
            <Nav.Link as={Link} className="link" to='/admin'>Admin</Nav.Link>
            <Nav.Link as={Link} className="link" to="/admin/add">Add</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
}

export default Header;
