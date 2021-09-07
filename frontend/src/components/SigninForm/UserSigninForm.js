import { Form, FormControl, Button } from 'react-bootstrap';

const UserSigninForm = ({signin}) => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center mt-5">
            <Form className="w-50" onSubmit={signin} id="signin_form_user">
                <FormControl type="email" placeholder="Email address" id="signin_email_user" className="mr-sm-2 mb-3" required/>
                <FormControl type="password" placeholder="Password" id="signin_password_user" className="mr-sm-2 mb-3" required/>
                <Button type="submit" className="w-100" variant="outline-primary">Sign In</Button>
            </Form>
        </div>
    );
}

export default UserSigninForm;