import React, { Component } from 'react';
import { Alert, Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupText, Row } from 'reactstrap';

// import 'bootstrap/dist/css/bootstrap.min.css';

import logoTroyX from '../../assets/logo192.png';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = { username: '', password: '', message: ''};
    this.login = this.login.bind(this);
  }

  componentDidMount () {
    //
  }

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  setMessage(message) {
    this.setState({ message: message })
  }

  render() {

    const alertLoginError = (
      this.state.message !== '' ? <Alert color="danger">
        {this.state.message}
      </Alert> : <div></div>
    );

    return (
      <div className="flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Card className="p-4" style={{ minWidth: '360px', maxWidth: '360px' }}>
              <CardBody>
                {alertLoginError}
                <img className='logo-login' src={logoTroyX} style={{ width : '250px'}} ></img>
                <Form onSubmit={this.login} >
                  <h1>Login</h1>
                  <p className="text-muted">Sign In to your account</p>
                  <InputGroup className="mb-3">
                    {/* <InputGroupAddon addonType="prepend"> */}
                      <InputGroupText>Username
                      </InputGroupText>
                    {/* </InputGroupAddon> */}
                    <Input type="text" name="username" autoComplete="username" value={this.state.username}
                      onChange={this.handleChange} />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    {/* <InputGroupAddon addonType="prepend"> */}
                      <InputGroupText>Password
                      </InputGroupText>
                    {/* </InputGroupAddon> */}
                    <Input type="password" name="password" autoComplete="current-password"
                      value={this.state.password} onChange={this.handleChange} />
                  </InputGroup>
                  <Row>
                    <Col xs="12" className="text-right">
                      <Button onClick={this.forgotPassword} color="link" className="px-0">Forgot password?</Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12">
                      <Button onClick={this.login} color="primary" className="px-4 w-100 mt-2">Login</Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Row>
        </Container>
      </div>
    );
  }

  async login() {

    if (this.state.username === '') {
      this.setMessage("The username is empty!");
    } else if (this.state.password === '') {
      this.setMessage("The password is empty!");
    } else {
        alert("haha Login")
    }

  }

  forgotPassword() {
    window.location.replace('#forgot-password');
  }

}

export default Login;
