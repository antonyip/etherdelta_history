import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import { Deposit, Order, Trade, User } from "../generated/schema"
class BasicInfo
{
    address: string;
    block_timestamp: BigInt; 
    block_number: BigInt; 
    add_from: string; 
    add_to:string;
    tx_id:string;
};

export function CollectBasicInfo(address: string , block_timestamp: BigInt , block_number: BigInt , add_from: string , add_to:string, tx_id: Bytes ) : BasicInfo
{
    let basicInfo = new BasicInfo();
    basicInfo.address = address;
    basicInfo.block_timestamp = block_timestamp;
    basicInfo.block_number = block_number;
    basicInfo.add_from = add_from;
    basicInfo.tx_id = tx_id.toHexString();
    basicInfo.add_to = add_to;
    return basicInfo;
}

function getOrCreateUser(address: string) : User
{
    let user = User.load(address);
    if (user == null)
    {
        user = new User(address);
        user.save();
    }
    return user as User;
}

export function InternalHandleOrder(basicInfo: BasicInfo, amountGet: BigInt, amountGive: BigInt, tokenGet: Address, tokenGive: Address, user: Address, expires: BigInt) : void
{
    let thisUser = getOrCreateUser(user.toHexString());

    let newOrder = new Order(basicInfo.tx_id)
    newOrder.block_number = basicInfo.block_number;
    newOrder.timestamp = basicInfo.block_timestamp;
    newOrder.user = user.toHexString();
    newOrder.amountGet = amountGet;
    newOrder.amountGive = amountGive;
    newOrder.tokenGet = tokenGet.toHexString();
    newOrder.tokenGive = tokenGive.toHexString();
    newOrder.save();

    thisUser.orders.push(newOrder.id);
    thisUser.save();
}

export function InternalHandleTrade(basicInfo: BasicInfo, amountGet: BigInt, amountGive: BigInt, tokenGet: Address, tokenGive: Address, get: Address, give: Address) : void
{
    let getUser = getOrCreateUser(get.toHexString());
    let giveUser = getOrCreateUser(give.toHexString());

    let newTrade = new Trade(basicInfo.tx_id)
    newTrade.block_number = basicInfo.block_number;
    newTrade.timestamp = basicInfo.block_timestamp;

    newTrade.amountGet = amountGet;
    newTrade.amountGive = amountGive;
    newTrade.tokenGet = tokenGet.toHexString();
    newTrade.tokenGive = tokenGive.toHexString();
    newTrade.getUser = get.toHexString();
    newTrade.giveUser = give.toHexString();
    newTrade.save();

    getUser.trades.push(newTrade.id);
    getUser.save();
    giveUser.trades.push(newTrade.id);
    giveUser.save();

}

export function InternalHandleDeposit(basicInfo: BasicInfo, user: Address, amount: BigInt, token: Address, balance: BigInt) : void
{
    let thisUser = getOrCreateUser(user.toHexString());

    let newDeposit = new Deposit(basicInfo.tx_id);
    newDeposit.block_number = basicInfo.block_number;
    newDeposit.timestamp = basicInfo.block_timestamp;

    newDeposit.user = user.toHexString();
    newDeposit.amount = amount;
    newDeposit.token = token.toHexString();
    newDeposit.save();
    thisUser.deposits.push(newDeposit.id);
    thisUser.save();
}

export function InternalHandleWithdraw(basicInfo: BasicInfo, user: Address, amount: BigInt, token: Address, balance: BigInt) : void
{
    let thisUser = getOrCreateUser(user.toHexString());

    let newWithdraw = new Deposit(basicInfo.tx_id);
    newWithdraw.block_number = basicInfo.block_number;
    newWithdraw.timestamp = basicInfo.block_timestamp;

    newWithdraw.user = user.toHexString();
    newWithdraw.amount = amount;
    newWithdraw.token = token.toHexString();
    newWithdraw.save();
    thisUser.withdraws.push(newWithdraw.id);
    thisUser.save();
}

export function InternalHandleCancel(basicInfo: BasicInfo, amountGet: BigInt, amountGive: BigInt, tokenGet: Address, tokenGive: Address, user: Address, expires: BigInt) : void
{
    let thisUser = getOrCreateUser(user.toHexString());

    let newCancel = new Order(basicInfo.tx_id)
    newCancel.block_number = basicInfo.block_number;
    newCancel.timestamp = basicInfo.block_timestamp;
    newCancel.user = user.toHexString();
    newCancel.amountGet = amountGet;
    newCancel.amountGive = amountGive;
    newCancel.tokenGet = tokenGet.toHexString();
    newCancel.tokenGive = tokenGive.toHexString();
    newCancel.save();
    thisUser.cancels.push(newCancel.id);
    thisUser.save();
}