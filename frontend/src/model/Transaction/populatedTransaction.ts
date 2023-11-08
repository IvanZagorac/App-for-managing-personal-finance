import Category from '../Category/category';

export default interface PopulatedTransaction{
    _id:string;
    accountId: string;
    categoryId: Category;
    time: string,
    description:string,
    transactionPrize:number,
    isDeposit:boolean,
}
    
    