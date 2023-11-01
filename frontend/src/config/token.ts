import { jwtDecode } from 'jwt-decode';
import DecodedToken from '../model/token';

// export function decodedToken()
// {
//     const token:string | null  = localStorage.getItem('token');
//     let decodedToken:any;
//     if(token!==null)
//     {
//         decodedToken = jwtDecode(token);
//     }

//     return decodedToken;

// }

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

// export function isTokenExpire()
// {
//     let isExpire = false;
//     if (decodedToken() && decodedToken().exp)
//     {
//         const currentTime = Math.floor(Date.now() / 1000);
//         const expirationTime = decodedToken().exp;
//         const remainingTime = expirationTime - currentTime;
//         console.log(remainingTime);
    
//         if (remainingTime < 0)
//         {
//             localStorage.removeItem('token');
//             isExpire = true;
//         }
//     }
    

//     return isExpire
// }

// export function tokenExist()
// {
//     const token=localStorage.getItem('token');
    
//     let isExist = true;
//     if(!token)
//     {
//         isExist = false;
//     }

//     return isExist;
// }
