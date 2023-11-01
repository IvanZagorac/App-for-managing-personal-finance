interface ResponseType {
    status:number;
    description?:string;
    error:boolean;
    resData?:any;
}

const ApiResponse = (res:ResponseType)=>
{

    return res;

}
export default ApiResponse