interface ResponseType {
    status:number;
    description?:string;
    error:boolean;
    resData?:any;
    ajvMessage?:string[];
}

const ApiResponse = (res:ResponseType)=>
{

    return res;

}
export default ApiResponse