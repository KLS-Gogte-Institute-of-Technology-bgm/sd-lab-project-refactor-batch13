import React,{ Component }from 'react';
//import { render } from 'react-dom';
//import { Control } from 'react-redux-form';
import {Form,Button, FormGroup, Input, Label ,Row,Col,Card,CardBody,CardTitle, CardImg} from 'reactstrap';
import { LocalForm, Control, Errors } from 'react-redux-form';
import Background from "./bg2.jpg";
const hStyle = { color: 'floralwhite', backgroundColor: '#9575CD' };
//const h2style = { background: `url(${Background})`};

class SignUp extends Component{
    
    
    constructor(props) {
        super(props);

        this.handleSignUp = this.handleSignUp.bind(this);
    }

    
    handleSignUp(values) {
        console.log("It is called");
        console.log(values.username,values.password,values.firstname,values.lastname);
        this.props.signupuser(values.username,values.password,values.firstname,values.lastname);
        //event.preventDefault();

}
render(){
    return (
        <div className="container mt-5 mb-5">
            <Card /*style={h2style}*/>
                <CardTitle><h2 align="center" className="mt-2" style={hStyle}>Sign Up Page</h2></CardTitle>
                <CardBody>
                    <CardImg className="media-left" src={Background}/>
        <LocalForm model="signup" onSubmit={(values) => this.handleSignUp(values)} >
                            <Row className="form-group">
                                <Label htmlFor="firstname" md={2} ><h4 style={{color:'#512DA8'}}>First Name</h4></Label>
                                <Col md={5}>
                                    <Control.text model=".firstname" id="firstname" name="firstname"
                                        className="form-control"
                                     />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="lastname" md={2}><h4 style={{color:'#512DA8'}}>Last Name</h4></Label>
                                <Col md={5}>
                                    <Control.text model=".lastname" id="lastname" name="lastname"
                                        className="form-control"
                                     />
                                </Col>
            </Row>
             <Row className="form-group">
                                <Label htmlFor="username" md={2}><h4 style={{color:'#512DA8'}}>User Name</h4></Label>
                                <Col md={5}>
                                    <Control.text model=".username" id="username" name="username"
                                        className="form-control"
                                     />
                                </Col>
            </Row>
                     <Row><Label htmlFor="password" md={2}><h4 style={{color:'#512DA8'}}>Password</h4></Label>
                                <Col md={5}><Control.text
                                type="password"
                                model=".password"
                            /></Col>
                                </Row>
                                        <Row className="form-group">
                                <Col md={{size:5, offset: 2}}>
                                    <Button type="submit" color="primary" className="btn">
                                   <h5 style={{color:'floralwhite'}}> SignUp</h5>
                                    </Button>
                                </Col>
                            </Row>
                    </LocalForm>
                    </CardBody>
                </Card>
            </div>
    );
}
}

export default SignUp;