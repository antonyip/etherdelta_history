import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import { Deposit, Withdraw, Order, Token, Trade, User, Cancel, PairActivityToToken } from "../generated/schema"
import { getOrCreateDailyActivity, getOrCreateDailyTokenActivity ,getTotalTokenActivity,getTotalActivity } from "./ActivityFunctions"

let ONE = BigInt.fromI32(1);

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

function getOrCreateToken(address: Address) : Token
{
    let uniqueKey = address.toHexString();
    let token = Token.load(uniqueKey);
    if (token == null)
    {
        token = new Token(uniqueKey);
        token.name = "todo..";
        token.address = address.toHexString();
        token.save();
    }
    return token as Token;
}

function getOrCreateActivityToToken(activityID: string, tokenActivityID: string) : PairActivityToToken {
    let id = activityID.concat("-").concat(tokenActivityID);
    let pairActivityToToken = PairActivityToToken.load(id);
    if (pairActivityToToken == null)
    {
        pairActivityToToken.activity = activityID;
        pairActivityToToken.tokenActivity = tokenActivityID;
    }
    pairActivityToToken.save();
    return pairActivityToToken as PairActivityToToken;
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
    newOrder.tokenGet = getOrCreateToken(tokenGet).id;
    newOrder.tokenGive = getOrCreateToken(tokenGive).id;
    newOrder.save();

    thisUser.orders.push(newOrder.id);
    thisUser.save();

    // Token Activity
    let tokenTotalActivityTokenGet = getTotalTokenActivity(newOrder.tokenGet);
    tokenTotalActivityTokenGet.orderCount = tokenTotalActivityTokenGet.orderCount.plus(ONE);
    tokenTotalActivityTokenGet.save();

    let tokenTotalActivityTokenGive = getTotalTokenActivity(newOrder.tokenGive);
    tokenTotalActivityTokenGive.orderCount = tokenTotalActivityTokenGive.orderCount.plus(ONE);
    tokenTotalActivityTokenGive.save();

    let tokenDailyActivityTokenGet = getOrCreateDailyTokenActivity(newOrder.timestamp, newOrder.tokenGet);
    tokenDailyActivityTokenGet.orderCount = tokenDailyActivityTokenGet.orderCount.plus(ONE);
    tokenDailyActivityTokenGet.save();

    let tokenDailyActivityTokenGive = getOrCreateDailyTokenActivity(newOrder.timestamp, newOrder.tokenGive);
    tokenDailyActivityTokenGive.orderCount = tokenDailyActivityTokenGive.orderCount.plus(ONE);
    tokenDailyActivityTokenGive.save();

    // total activity
    let activity = getTotalActivity();
    activity.orders.push(newOrder.id);
    activity.TotalOrderCount = activity.TotalOrderCount.plus(ONE);
    activity.NetOrderCount = activity.NetOrderCount.plus(ONE);
    
    let PairActivityToToken = getOrCreateActivityToToken(activity.id, tokenTotalActivityTokenGet.id);
    activity.TokenActivity.push(PairActivityToToken.id);

    PairActivityToToken = getOrCreateActivityToToken(activity.id, tokenTotalActivityTokenGive.id);
    activity.TokenActivity.push(PairActivityToToken.id);
    
    activity.UniqueUsers.push(thisUser.id);
    activity.save();

    // daily activity
    activity = getOrCreateDailyActivity(basicInfo.block_timestamp);
    activity.orders.push(newOrder.id);
    activity.TotalOrderCount = activity.TotalOrderCount.plus(ONE);
    activity.NetOrderCount = activity.NetOrderCount.plus(ONE);
    let PairActivityToTokenDaily = getOrCreateActivityToToken(activity.id, tokenDailyActivityTokenGet.id);
    activity.TokenActivity.push(PairActivityToTokenDaily.id);

    PairActivityToTokenDaily = getOrCreateActivityToToken(activity.id, tokenDailyActivityTokenGive.id);
    activity.TokenActivity.push(PairActivityToTokenDaily.id);

    activity.UniqueUsers.push(thisUser.id);
    activity.save();


}

export function InternalHandleTrade(basicInfo: BasicInfo, amountGet: BigInt, amountGive: BigInt, tokenGet: Address, tokenGive: Address, get: Address, give: Address) : void
{
    let getUser = getOrCreateUser(get.toHexString());
    let newTrade = new Trade(basicInfo.tx_id)
    newTrade.block_number = basicInfo.block_number;
    newTrade.timestamp = basicInfo.block_timestamp;

    newTrade.amountGet = amountGet;
    newTrade.amountGive = amountGive;
    newTrade.tokenGet = getOrCreateToken(tokenGet).id;
    newTrade.tokenGive = getOrCreateToken(tokenGive).id;
    newTrade.getUser = get.toHexString();
    newTrade.giveUser = give.toHexString();
    newTrade.save();

    getUser.getTrades.push(newTrade.id);
    getUser.save();

    // Token Activity
    let tokenTotalActivityTokenGet = getTotalTokenActivity(newTrade.tokenGet);
    tokenTotalActivityTokenGet.tradeCount = tokenTotalActivityTokenGet.tradeCount.plus(ONE);
    tokenTotalActivityTokenGet.save();

    let tokenTotalActivityTokenGive = getTotalTokenActivity(newTrade.tokenGive);
    tokenTotalActivityTokenGive.tradeCount = tokenTotalActivityTokenGive.tradeCount.plus(ONE);
    tokenTotalActivityTokenGive.save();

    let tokenDailyActivityTokenGet = getOrCreateDailyTokenActivity(newTrade.timestamp, newTrade.tokenGet);
    tokenDailyActivityTokenGet.tradeCount = tokenDailyActivityTokenGet.tradeCount.plus(ONE);
    tokenDailyActivityTokenGet.save();

    let tokenDailyActivityTokenGive = getOrCreateDailyTokenActivity(newTrade.timestamp, newTrade.tokenGive);
    tokenDailyActivityTokenGive.tradeCount = tokenDailyActivityTokenGive.tradeCount.plus(ONE);
    tokenDailyActivityTokenGive.save();

    // total activity
    let activity = getTotalActivity();
    activity.trade.push(newTrade.id);
    activity.TotalTradeCount = activity.TotalTradeCount.plus(ONE);
    let PairActivityToToken = getOrCreateActivityToToken(activity.id, tokenTotalActivityTokenGet.id);
    activity.TokenActivity.push(PairActivityToToken.id);

    PairActivityToToken = getOrCreateActivityToToken(activity.id, tokenTotalActivityTokenGive.id);
    activity.TokenActivity.push(PairActivityToToken.id);

    activity.UniqueUsers.push(getUser.id);
    activity.save();

    // daily activity
    activity = getOrCreateDailyActivity(basicInfo.block_timestamp);
    activity.trade.push(newTrade.id);
    activity.TotalTradeCount = activity.TotalTradeCount.plus(ONE);
    let PairActivityToTokenDaily = getOrCreateActivityToToken(activity.id, tokenDailyActivityTokenGet.id);
    activity.TokenActivity.push(PairActivityToTokenDaily.id);

    PairActivityToTokenDaily = getOrCreateActivityToToken(activity.id, tokenDailyActivityTokenGive.id);
    activity.TokenActivity.push(PairActivityToTokenDaily.id);
    activity.UniqueUsers.push(getUser.id);
    activity.save();


}

export function InternalHandleDeposit(basicInfo: BasicInfo, user: Address, amount: BigInt, token: Address, balance: BigInt) : void
{
    let thisUser = getOrCreateUser(user.toHexString());

    let newDeposit = new Deposit(basicInfo.tx_id);
    newDeposit.block_number = basicInfo.block_number;
    newDeposit.timestamp = basicInfo.block_timestamp;

    newDeposit.user = user.toHexString();
    newDeposit.amount = amount;
    newDeposit.token = getOrCreateToken(token).id;
    newDeposit.balance = balance;
    newDeposit.save();
    thisUser.deposits.push(newDeposit.id);
    thisUser.save();

    // Token Activity
    let tokenActivity = getTotalTokenActivity(newDeposit.token);
    tokenActivity.depositCount = tokenActivity.depositCount.plus(ONE);
    tokenActivity.save();

    let dailyTokenActivity = getOrCreateDailyTokenActivity(newDeposit.timestamp, newDeposit.token);
    dailyTokenActivity.depositCount = dailyTokenActivity.depositCount.plus(ONE);
    dailyTokenActivity.save();
    
    // total activity
    let activity = getTotalActivity();
    activity.deposit.push(newDeposit.id);
    activity.TotalDeposits = activity.TotalDeposits.plus(ONE);
    activity.NetDeposits = activity.NetDeposits.plus(ONE);
    let PairActivityToToken = getOrCreateActivityToToken(activity.id, tokenActivity.id);
    activity.TokenActivity.push(PairActivityToToken.id);
    activity.UniqueUsers.push(thisUser.id);
    activity.save();

    // daily activity
    activity = getOrCreateDailyActivity(basicInfo.block_timestamp);
    activity.deposit.push(newDeposit.id);
    activity.TotalDeposits = activity.TotalDeposits.plus(ONE);
    activity.NetDeposits = activity.NetDeposits.plus(ONE);
    let PairActivityToTokenDaily = getOrCreateActivityToToken(activity.id, dailyTokenActivity.id);
    activity.TokenActivity.push(PairActivityToTokenDaily.id);
    activity.UniqueUsers.push(thisUser.id);
    activity.save();
}

export function InternalHandleWithdraw(basicInfo: BasicInfo, user: Address, amount: BigInt, token: Address, balance: BigInt) : void
{
    let thisUser = getOrCreateUser(user.toHexString());

    let newWithdraw = new Withdraw(basicInfo.tx_id);
    newWithdraw.block_number = basicInfo.block_number;
    newWithdraw.timestamp = basicInfo.block_timestamp;

    newWithdraw.user = user.toHexString();
    newWithdraw.amount = amount;
    newWithdraw.token = getOrCreateToken(token).id;
    newWithdraw.balance = balance;
    newWithdraw.save();
    thisUser.withdraws.push(newWithdraw.id);
    thisUser.save();
    

    // Token Activity
    let tokenActivity = getTotalTokenActivity(newWithdraw.token);
    tokenActivity.withdrawCount = tokenActivity.withdrawCount.plus(ONE);
    tokenActivity.save();

    let dailyTokenActivity = getOrCreateDailyTokenActivity(newWithdraw.timestamp, newWithdraw.token);
    dailyTokenActivity.withdrawCount = dailyTokenActivity.withdrawCount.plus(ONE);
    dailyTokenActivity.save();

    // total activity
    let activity = getTotalActivity();
    activity.deposit.push(newWithdraw.id);
    activity.TotalWithdraws = activity.TotalWithdraws.plus(ONE);
    activity.NetDeposits = activity.NetDeposits.minus(ONE);
    let PairActivityToToken = getOrCreateActivityToToken(activity.id, tokenActivity.id);
    activity.TokenActivity.push(PairActivityToToken.id);
    activity.UniqueUsers.push(thisUser.id);
    activity.save();

    // daily activity
    activity = getOrCreateDailyActivity(basicInfo.block_timestamp);
    activity.deposit.push(newWithdraw.id);
    activity.TotalWithdraws = activity.TotalWithdraws.plus(ONE);
    activity.NetDeposits = activity.NetDeposits.minus(ONE);
    let PairActivityToTokenDaily = getOrCreateActivityToToken(activity.id, dailyTokenActivity.id);
    activity.TokenActivity.push(PairActivityToTokenDaily.id);
    activity.UniqueUsers.push(thisUser.id);
    activity.save();


}

export function InternalHandleCancel(basicInfo: BasicInfo, amountGet: BigInt, amountGive: BigInt, tokenGet: Address, tokenGive: Address, user: Address, expires: BigInt) : void
{
    let thisUser = getOrCreateUser(user.toHexString());

    let newCancel = new Cancel(basicInfo.tx_id)
    newCancel.block_number = basicInfo.block_number;
    newCancel.timestamp = basicInfo.block_timestamp;
    newCancel.user = user.toHexString();
    newCancel.amountGet = amountGet;
    newCancel.amountGive = amountGive;
    newCancel.tokenGet = getOrCreateToken(tokenGet).id;
    newCancel.tokenGive = getOrCreateToken(tokenGive).id;
    newCancel.save();
    thisUser.cancels.push(newCancel.id);
    thisUser.save();

    // Token Activity
    let tokenTotalActivityTokenGet = getTotalTokenActivity(newCancel.tokenGet);
    tokenTotalActivityTokenGet.cancelCount = tokenTotalActivityTokenGet.cancelCount.plus(ONE);
    tokenTotalActivityTokenGet.save();

    let tokenTotalActivityTokenGive = getTotalTokenActivity(newCancel.tokenGive);
    tokenTotalActivityTokenGive.cancelCount = tokenTotalActivityTokenGive.cancelCount.plus(ONE);
    tokenTotalActivityTokenGive.save();

    let tokenDailyActivityTokenGet = getOrCreateDailyTokenActivity(newCancel.timestamp, newCancel.tokenGet);
    tokenDailyActivityTokenGet.cancelCount = tokenDailyActivityTokenGet.cancelCount.plus(ONE);
    tokenDailyActivityTokenGet.save();

    let tokenDailyActivityTokenGive = getOrCreateDailyTokenActivity(newCancel.timestamp, newCancel.tokenGive);
    tokenDailyActivityTokenGive.cancelCount = tokenDailyActivityTokenGive.cancelCount.plus(ONE);
    tokenDailyActivityTokenGive.save();
   
    // total activity
    let activity = getTotalActivity();
    activity.cancel.push(newCancel.id);
    activity.TotalCancelCount = activity.TotalCancelCount.plus(ONE);
    activity.NetOrderCount = activity.NetOrderCount.minus(ONE);
    let PairActivityToToken = getOrCreateActivityToToken(activity.id, tokenTotalActivityTokenGet.id);
    activity.TokenActivity.push(PairActivityToToken.id);

    PairActivityToToken = getOrCreateActivityToToken(activity.id, tokenTotalActivityTokenGive.id);
    activity.TokenActivity.push(PairActivityToToken.id);
    activity.UniqueUsers.push(thisUser.id);
    activity.save();

    // daily activity
    activity = getOrCreateDailyActivity(basicInfo.block_timestamp);
    activity.cancel.push(newCancel.id);
    activity.TotalCancelCount = activity.TotalCancelCount.plus(ONE);
    activity.NetOrderCount = activity.NetOrderCount.minus(ONE);
    let PairActivityToTokenDaily = getOrCreateActivityToToken(activity.id, tokenDailyActivityTokenGet.id);
    activity.TokenActivity.push(PairActivityToTokenDaily.id);

    PairActivityToTokenDaily = getOrCreateActivityToToken(activity.id, tokenDailyActivityTokenGive.id);
    activity.TokenActivity.push(PairActivityToTokenDaily.id);
    activity.UniqueUsers.push(thisUser.id);
    activity.save();


}


