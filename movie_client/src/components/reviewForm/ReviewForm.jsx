import {Form,Button} from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const ReviewForm = ({handleSubmit,revText,labelText,defaultValue}) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="login-prompt">
        Please <a href="/login">login</a> to write a review.
      </div>
    );
  }

  return (
    <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>{labelText}</Form.Label>
            <Form.Control ref={revText} as="textarea" rows={3} defaultValue={defaultValue} />
        </Form.Group>
        <Button variant="outline-info" onClick={handleSubmit}>Submit</Button>
    </Form>   
  )
}

export default ReviewForm