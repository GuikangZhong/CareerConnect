import { Form, FormControl, Button } from 'react-bootstrap';

const CompanySignupForm = ({signup}) => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center mt-5">
            <Form className="w-50" onSubmit={signup} id="signup_form_company">
                <FormControl type="email" placeholder="Email address" id="signup_email_company" className="mr-sm-2 mb-3" required/>
                <FormControl type="text" placeholder="Name" id="signup_name_company" className="mr-sm-2 mb-3" required/>
                <FormControl type="password" placeholder="Password" id="signup_password_company" className="mr-sm-2 mb-3" required/>
                <Button type="submit" className="w-100" variant="outline-primary">Sign Up</Button>
            </Form>
        </div>
    );
}

export default CompanySignupForm;