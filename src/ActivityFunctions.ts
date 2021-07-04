import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import { Activity, TokenActivity } from "../generated/schema"

let TIME_SECONDS = BigInt.fromI32(60);
let TIME_MINUTES = BigInt.fromI32(60);
let TIME_HOURS = BigInt.fromI32(24);
let ZERO = BigInt.fromI32(0);

export function getOrCreateDailyActivity(timestamp: BigInt) : Activity
{
    let timestampDay = timestamp;
    if (!timestampDay.equals(ZERO))
    {
        timestampDay = timestamp.div(TIME_SECONDS).div(TIME_MINUTES).div(TIME_HOURS);
    }
    
    let activity = Activity.load(timestampDay.toString())
    if (activity == null)
    {
        activity = new Activity(timestampDay.toString())
        activity.dayTimestamp = timestampDay;
        activity.TotalOrderCount = ZERO
        activity.TotalCancelCount = ZERO
        activity.NetOrderCount = ZERO
        activity.TotalDeposits = ZERO
        activity.TotalWithdraws = ZERO
        activity.NetDeposits = ZERO
        activity.TotalTradeCount = ZERO
    }
    activity.save();
    return activity as Activity;
}

export function getOrCreateDailyTokenActivity(timestamp: BigInt, add: string) : TokenActivity
{
    let timestampDay = timestamp;
    if (!timestampDay.equals(ZERO))
    {
        timestampDay = timestamp.div(TIME_SECONDS).div(TIME_MINUTES).div(TIME_HOURS);
    }
    let id = add.concat("-").concat(timestampDay.toString());
    let tokenActivity = TokenActivity.load(id)
    if (tokenActivity == null)
    {
        tokenActivity = new TokenActivity(id)
        tokenActivity.dayTimestamp = timestampDay;
        tokenActivity.address = add;
        tokenActivity.tradeCount = ZERO
        tokenActivity.withdrawCount = ZERO
        tokenActivity.depositCount = ZERO
        tokenActivity.orderCount = ZERO
        tokenActivity.cancelCount = ZERO
    }
    tokenActivity.save();
    return tokenActivity as TokenActivity;
}

export function getTotalActivity() : Activity
{
    return getOrCreateDailyActivity(ZERO);
}

export function getTotalTokenActivity(add: string) : TokenActivity
{
    return getOrCreateDailyTokenActivity(ZERO, add);
}