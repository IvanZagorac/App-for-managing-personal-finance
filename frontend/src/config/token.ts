import { jwtDecode } from 'jwt-decode';
import DecodedToken from '../model/Auth/token';

export function togetherFunction()
{
    const decodedToken:DecodedToken={
        value: null,
        isExpire: false,
        isExist: false,
        
    }
    const token:string | null  = localStorage.getItem('token');
    if (token !== null)
    {
        decodedToken.value = jwtDecode(token);
        decodedToken.isExist = true;
    }

    if (decodedToken.value != null)
    {
        const currentTime = Math.floor(Date.now() / 1000);
        const expirationTime = decodedToken.value.exp
        const remainingTime = expirationTime - currentTime;
        console.log(remainingTime);
        if (remainingTime < 0)
        {
            localStorage.removeItem('token');
            decodedToken.isExpire = true;
        }
        
    }

    return decodedToken;


}
