import React from "react";
import { useState } from "react";
import { Dropdown, Form, Button, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { alertService } from "services/AlertService";
import { userService } from "services/UserService";

function Login() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    let history = useHistory();

    function submit() {
        console.log("submit", login, password);
        return userService
            .login(login, password)
            .then(() => {
                console.log("Login success!", userService.userValue);
                history.push("/admin");
            })
            .catch(alertService.error);
    }

    function onLoginChange(e) {
        setLogin(e.target.value);
    }

    function onPasswordChange(e) {
        setPassword(e.target.value);
    }

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle id="dropdown-custom-components">
                    <a>Admin</a>
                </Dropdown.Toggle>

                <Dropdown.Menu className="loginMenu">
                    <Form>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Row>
                                <Col sm={5} className="text-right">
                                    <Form.Label>Login</Form.Label>
                                </Col>
                                <Col sm={6}>
                                    <Form.Control
                                        type="email"
                                        placeholder="Login"
                                        onChange={onLoginChange}
                                        value={login}
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlPassword">
                            <Row>
                                <Col sm={5} className="text-right">
                                    <Form.Label>Password</Form.Label>
                                </Col>
                                <Col sm={6}>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        onChange={onPasswordChange}
                                        value={password}
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.Submit">
                            <Row>
                                <Col sm={{ span: 4, offset: 7 }}>
                                    <Button variant="success" onClick={submit}>
                                        Login
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}

export { Login };
