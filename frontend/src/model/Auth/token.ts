interface Token {
    email:string;
    _id:string;
    fullName:string;
    exp:number;
    iat:number;

}

export default interface DecodedToken {
    value:Token | null;
    isExpire:boolean;
    isExist:boolean;
}