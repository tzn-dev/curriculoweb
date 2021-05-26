import React, {useState, useRef, useEffect} from 'react';
import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Container, Col, FormFeedback } from 'reactstrap';
import { useFormik } from 'formik';
import { useHistory } from "react-router-dom";
import { api_login } from '../../services/api.js';
import * as yup from 'yup';
import axios from 'axios';
import NotificationAlert from "react-notification-alert";
import Logo from 'components/Logo/Logo.js';

export default function LoginCard() {
  const notifica = useRef();
  
  // useEffect(() => {
  //   console.log(notifica.current.NotificationAlert)
  // }, [])

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: yup.object({
      email: yup.string().email('Email inválido').required('Insira seu Email!'),
      password: yup.string().required('Insira sua Senha!'),
    })
  })
  const history = useHistory();
  const routeChange = () => {
    history.push('/dashboard');
  }

  const notify = (type, msg) => {
    const options = {
      place: 'tc',
      message: (
        <div className="alert-text">
          <span className="alert-title" data-notify="title">
           {''}
           Aviso 
          </span>
          <span data-notify="message">{msg}</span>
        </div>
      ),
      type: type,
      icon: "ni ni-bell-55",
      autoDismiss: 3
    };
    notifica.current.notificationAlert(options)
  };

  function btLogin() {
    const { email, password } = formik.values;
    const user = { 'email': email, 'senha': password };
    if (email != '' && password != '') {
      axios.post(`${api_login}`, user)
      .then(res => {
          if (res.data.token != null) {
            localStorage.setItem('token', res.data.token);
            routeChange();
          }
      }).catch((err) => {
        notify('danger', 'Email ou Senha Inválidos!')
        // console.log('nao foi possivel fazer o login');
        //console.log(err);
      })
    }
  }

  return (
    <>
      <div className="rna-wrapper">
        <NotificationAlert ref={notifica} />
      </div>
      <section className="upper">
        <Container>
          <Col className="mx-auto" lg="5" md="8">
            <Card className="bg-secondary shadow border-0">
              <CardHeader className="bg-white pb-5">
                <div className="text-muted text-center mb-3">
                  <small>Login</small>
                </div>
                <Logo />
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <small>Entre com suas credenciais</small>
                </div>
                <Form role="form">
                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input placeholder="Email" id="email" type="email"
                        invalid={formik.touched.email && formik.errors.email ? true : false}
                        {...formik.getFieldProps('email')} />
                      <FormFeedback>{formik.touched.email && formik.errors.email ? formik.errors.email : null}</FormFeedback>
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input placeholder="Senha" id="password" type="password"
                        invalid={formik.touched.password && formik.errors.password ? true : false}
                        {...formik.getFieldProps('password')} />
                      <FormFeedback>{formik.touched.password && formik.errors.password ? formik.errors.password : null}</FormFeedback>
                    </InputGroup>
                  </FormGroup>
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input className="custom-control-input" id="customCheckLogin2" type="checkbox" />
                    <label className="custom-control-label" htmlFor="customCheckLogin2">
                      <span className="text-default opacity-5">Lembrar-me</span>
                    </label>
                  </div>
                  <div className="text-center">
                    <Button className="my-4" color="primary" onClick={btLogin} >
                      Entrar
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Container>
      </section>
    </>
  );
}