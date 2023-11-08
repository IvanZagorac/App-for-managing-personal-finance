interface ResponseType {
    status:number;
    description?:string;
    error:boolean;
    resData?:any;
    ajvMessage?:string[];
    totalCount?:number;
}

const ApiResponse = (res:ResponseType)=>
{

    return res;

}
export default ApiResponse