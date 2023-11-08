export default interface TransactionWithId{
    _id:string;
    accountId: string;
    categoryId: string;
    time: string,
    description:string,
    transactionPrize:number,
    isDeposit:boolean,
}
    
    