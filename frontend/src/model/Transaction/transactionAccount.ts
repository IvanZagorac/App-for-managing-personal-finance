import Account from '../Account/account';
import Category from '../Category/category';

export default interface TransactionAccount{
    _id:string;
    accountId: Account;
    categoryId: Category;
    time: string,
    description:string,
    transactionPrize:number,
    isDeposit:boolean,
}
    
    