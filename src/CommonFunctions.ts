import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import { Deposit, Withdraw, Order, Token, Trade, User, Cancel } from "../generated/schema"
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
        //token.balance = new BigInt(0);
        //token.address = address.toHexString();
        //token.user = getOrCreateUser(user.toHexString()).id;
        token.save();
    }
    return token as Token;
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

    // total activity
    let activity = getTotalActivity();
    activity.orders.push(newOrder.id);
    activity.TotalOrderCount = activity.TotalOrderCount.plus(ONE);
    activity.NetOrderCount = activity.NetOrderCount.plus(ONE);
    activity.TokenActivity.push(newOrder.tokenGet);
    activity.TokenActivity.push(newOrder.tokenGive);
    activity.UniqueUsers.push(thisUser.id);
    activity.save();

    // daily activity
    activity = getOrCreateDailyActivity(basicInfo.block_timestamp);
    activity.orders.push(newOrder.id);
    activity.TotalOrderCount = activity.TotalOrderCount.plus(ONE);
    activity.NetOrderCount = activity.NetOrderCount.plus(ONE);
    activity.TokenActivity.push(newOrder.tokenGet);
    activity.TokenActivity.push(newOrder.tokenGive);
    activity.UniqueUsers.push(thisUser.id);
    activity.save();
}

export function InternalHandleTrade(basicInfo: BasicInfo, amountGet: BigInt, amountGive: BigInt, tokenGet: Address, tokenGive: Address, get: Address, give: Address) : void
{
    let getUser = getOrCreateUser(get.toHexString());
    let newTradeGet = new Trade(basicInfo.tx_id)
    newTradeGet.block_number = basicInfo.block_number;
    newTradeGet.timestamp = basicInfo.block_timestamp;

    newTradeGet.amountGet = amountGet;
    newTradeGet.amountGive = amountGive;
    newTradeGet.tokenGet = getOrCreateToken(tokenGet).id;
    newTradeGet.tokenGive = getOrCreateToken(tokenGive).id;
    newTradeGet.getUser = get.toHexString();
    newTradeGet.giveUser = give.toHexString();
    newTradeGet.save();

    getUser.getTrades.push(newTradeGet.id);
    getUser.save();

    // total activity
    let activity = getTotalActivity();
    activity.trade.push(newTradeGet.id);
    activity.TotalTradeCount = activity.TotalTradeCount.plus(ONE);
    activity.TokenActivity.push(newTradeGet.tokenGet);
    activity.TokenActivity.push(newTradeGet.tokenGive);
    activity.UniqueUsers.push(getUser.id);
    activity.save();

    // daily activity
    activity = getOrCreateDailyActivity(basicInfo.block_timestamp);
    activity.trade.push(newTradeGet.id);
    activity.TotalTradeCount = activity.TotalTradeCount.plus(ONE);
    activity.TokenActivity.push(newTradeGet.tokenGet);
    activity.TokenActivity.push(newTradeGet.tokenGive);
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

    // total activity
    let activity = getTotalActivity();
    activity.deposit.push(newDeposit.id);
    activity.TotalDeposits = activity.TotalDeposits.plus(ONE);
    activity.NetDeposits = activity.NetDeposits.plus(ONE);
    activity.TokenActivity.push(newDeposit.token);
    activity.UniqueUsers.push(thisUser.id);
    activity.save();

    // daily activity
    activity = getOrCreateDailyActivity(basicInfo.block_timestamp);
    activity.deposit.push(newDeposit.id);
    activity.TotalDeposits = activity.TotalDeposits.plus(ONE);
    activity.NetDeposits = activity.NetDeposits.plus(ONE);
    activity.TokenActivity.push(newDeposit.token);
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

    // total activity
    let activity = getTotalActivity();
    activity.deposit.push(newWithdraw.id);
    activity.TotalWithdraws = activity.TotalWithdraws.minus(ONE);
    activity.NetDeposits = activity.NetDeposits.minus(ONE);
    activity.TokenActivity.push(newWithdraw.token);
    activity.UniqueUsers.push(thisUser.id);
    activity.save();

    // daily activity
    activity = getOrCreateDailyActivity(basicInfo.block_timestamp);
    activity.deposit.push(newWithdraw.id);
    activity.TotalWithdraws = activity.TotalWithdraws.minus(ONE);
    activity.NetDeposits = activity.NetDeposits.minus(ONE);
    activity.TokenActivity.push(newWithdraw.token);
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

    // total activity
    let activity = getTotalActivity();
    activity.cancel.push(newCancel.id);
    activity.TotalCancelCount = activity.TotalCancelCount.plus(ONE);
    activity.NetOrderCount = activity.NetOrderCount.minus(ONE);
    activity.TokenActivity.push(newCancel.tokenGet);
    activity.TokenActivity.push(newCancel.tokenGive);
    activity.UniqueUsers.push(thisUser.id);
    activity.save();

    // daily activity
    activity = getOrCreateDailyActivity(basicInfo.block_timestamp);
    activity.cancel.push(newCancel.id);
    activity.TotalCancelCount = activity.TotalCancelCount.plus(ONE);
    activity.NetOrderCount = activity.NetOrderCount.minus(ONE);
    activity.TokenActivity.push(newCancel.tokenGet);
    activity.TokenActivity.push(newCancel.tokenGive);
    activity.UniqueUsers.push(thisUser.id);
    activity.save();
}

// Activity Counting
/*
type Activity @entity {
    "block_timestamp/60/60/24 (0 is current id)"
    id: ID!
    orders: [Order]!
    trade: [Trade]!
    deposit: [Deposit]!
    withdraw: [Withdraw]!
    cancel: [Cancel]!
  
    TotalOrderCount: BigInt!
    TotalWithdrawCount: BigInt!
    NetOrderCount: BigInt!
    TotalDeposits: BigInt!
    TotalWithdraws: BigInt!
    NetDeposits: BigInt!
    TotalTradeCount: BigInt!
  
    TokenActivity: [TokenActivity]!
    UniqueUsers: [User]!
  }
  
  type TokenActivity @entity {
    "block_timestamp/60/60/24-address (0 is the current id)"
    id: ID!
    "token address"
    address: String!
    tradeCount: BigInt!
    withdrawCount: BigInt!
    depositCount: BigInt!
    orderCount: BigInt!
    cancelCount: BigInt!
  }
*/