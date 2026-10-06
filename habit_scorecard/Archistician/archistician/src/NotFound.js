/* This page is rendered when a user attempts to go to a route that does not exist */
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found">
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link to="/">Go back to the homepage...</Link>
    </div>
  )
}

export default NotFound;