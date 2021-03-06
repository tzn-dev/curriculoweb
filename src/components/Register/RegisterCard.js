import React, { useRef } from 'react';
import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Container, Col, FormFeedback, Row } from 'reactstrap';
import { useFormik } from 'formik';
import { useHistory, Link } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { api_cadastro } from 'services/api';
import * as yup from 'yup';
import axios from 'axios'
import userActions from '../../store/actions/userActions'
import curriculoActions from '../../store/actions/curriculoActions'
import NotificationAlert from "react-notification-alert";
import { useNotify } from "hooks/useNotify";

export default function LoginCard() {
  const history = useHistory()
  const dispatch = useDispatch()
  const routeChange = () => { history.push('/dados_iniciais') }
  const notify = useNotify()
  const formik = useFormik({
    initialValues: {
      userName: '',
      email: '',
      password: '',
      changePassword: '',
      acceptTerms: false,
    },
    validationSchema: yup.object({
      userName: yup.string().required('Insira um nome de usuário!'),
      email: yup.string().email('Email inválido').required('Insira um e-mail válido!'),
      password: yup.string().required('Insira uma senha forte!'),
      changePassword: yup.string().when("password", {
        is: val => (val && val.length > 0 ? true : false),
        then: yup.string().oneOf(
          [yup.ref("password")],
          "Ambas as senhas devem ser iguais!"
        )
      }),
      acceptTerms: yup.bool().oneOf([true], 'Você deve concordar com os Termos antes de cadastrar.'),
    })
  });
  const register = () => {
    const { userName, email, password, changePassword, acceptTerms } = formik.values;
    const user = { 'nome': userName, 'email': email, 'senha': password };
    if (email != '' && password != '' && acceptTerms === true) {
      if (password === changePassword) {
        axios.post(`${api_cadastro}`, user).then(res => {
          if (res.status == 200) {
            if (res.data.token != null) {
              sessionStorage.setItem('token', res.data.token);
              dispatch(userActions.carrega_foto(res.data.user.thumbnail))
              dispatch(userActions.add_token(res.data.token));
              dispatch(userActions.add_user(res.data.user));
              dispatch(curriculoActions.busca_curriculo(res.data.user._id))
              routeChange();
              dispatch(userActions.add_controle());
              dispatch(userActions.busca_user());
            }
          }
        }).catch(error => {
          notify('danger', 'Não foi possivel fazer o cadastro')
        })
      } else {
        notify('danger', 'As senhas nao coincidem');
      }
    }
  }
  return (
    <>
      <div className="rna-wrapper"><NotificationAlert ref={notify.notifica} /></div>
      <Container>
        <Col className="mx-auto" lg="5" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-white p-3">
              <div className="text-muted text-center mb-3">
                <h4>Cadastro</h4>
              </div>
              <div className="logo"/>
            </CardHeader>
            <CardBody className="px-lg-4 py-lg-4">
              <div className="text-center text-muted mb-4">
                <small>Entre com suas credenciais</small>
              </div>
              <Form role="form" onSubmit={formik.handleSubmit}>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-circle-08" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input autoFocus className="form-control-alternative" placeholder="Nome" id="userName" type="text"
                      invalid={formik.touched.userName && formik.errors.userName ? true : false}
                      {...formik.getFieldProps('userName')} />
                    <FormFeedback>{formik.touched.userName && formik.errors.userName ? formik.errors.userName : null}</FormFeedback>
                  </InputGroup>
                </FormGroup>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input className="form-control-alternative" placeholder="Email" type="email" id="email"
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
                    <Input className="form-control-alternative" placeholder="Senha" type="password" id="password"
                      invalid={formik.touched.password && formik.errors.password ? true : false}
                      {...formik.getFieldProps('password')} />
                    <FormFeedback>{formik.touched.password && formik.errors.password ? formik.errors.password : null}</FormFeedback>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input className="form-control-alternative" placeholder="Confirmar Senha" type="password" id="changePassword"
                      invalid={formik.touched.changePassword && formik.errors.changePassword ? true : false}
                      {...formik.getFieldProps('changePassword')} />
                    <FormFeedback>{formik.touched.changePassword && formik.errors.changePassword ? formik.errors.changePassword : null}</FormFeedback>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <div className="custom-control custom-checkbox mb-3">
                    <Input className="form-control-alternative custom-control-input" id="acceptTerms" type="checkbox"
                      invalid={formik.touched.acceptTerms && formik.errors.acceptTerms ? true : false}
                      {...formik.getFieldProps('acceptTerms')} />
                    <label className="custom-control-label" htmlFor="acceptTerms">
                      Aceite os termos e condições ao cadastrar.
                    </label>
                    <FormFeedback>{formik.touched.acceptTerms && formik.errors.acceptTerms ? formik.errors.acceptTerms : null}</FormFeedback>
                  </div>
                </FormGroup>
                <div className="text-center">
                  <Button className="my-3" color="primary" onClick={register}>Cadastrar</Button>
                </div>
              </Form>
              <Row className="justify-content-center mt-3">
                <Link className="align-items-center" to="/reset" style={{display: 'flex'}}>
                  <i className="ni ni-lg ni-bold-right"/>
                  <span>Redefinir senha</span>
                </Link>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Container>
    </>
  );
}