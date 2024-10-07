import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../components/auth/authContext';
import ROUTES from './router';

const PrivateRoute = ({children, ...rest}) => {
    let { user } = useContext(AuthContext)
    return !user ? <Navigate to={ROUTES.MCC_BACK_LOGIN}/> : children;
}

export default PrivateRoute;