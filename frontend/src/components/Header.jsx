import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Login } from '../pages/Login';
import { Link } from 'react-router-dom';

export default function Header(){
    return(
        <div>
        <ConnectButton/>
        <Link to="/login">login</Link>
        <Link to="/signup">signup</Link>
        </div>
    )
}