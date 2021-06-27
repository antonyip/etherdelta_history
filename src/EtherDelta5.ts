import { BigInt } from "@graphprotocol/graph-ts"
import {
  EtherDelta5,
  Order,
  Cancel,
  Trade,
  Deposit,
  Withdraw
} from "../generated/EtherDelta5/EtherDelta5"

import { CollectBasicInfo, InternalHandleCancel, InternalHandleDeposit, InternalHandleOrder, InternalHandleTrade, InternalHandleWithdraw } from "./CommonFunctions"

export function handleOrder(event: Order): void {
  let basicInfo = CollectBasicInfo(event.address.toHexString(), event.block.timestamp, event.block.number, event.transaction.from.toHexString(), event.transaction.to.toHexString(), event.transaction.hash);
  InternalHandleOrder(basicInfo, event.params.amountGet, event.params.amountGive, event.params.tokenGet, event.params.tokenGive, event.params.user, event.params.expires);
}

export function handleTrade(event: Trade): void {
  let basicInfo = CollectBasicInfo(event.address.toHexString(), event.block.timestamp, event.block.number, event.transaction.from.toHexString(), event.transaction.to.toHexString(), event.transaction.hash);
  InternalHandleTrade(basicInfo, event.params.amountGet, event.params.amountGive, event.params.tokenGet, event.params.tokenGive, event.params.get, event.params.give);
}

export function handleDeposit(event: Deposit): void {
  let basicInfo = CollectBasicInfo(event.address.toHexString(), event.block.timestamp, event.block.number, event.transaction.from.toHexString(), event.transaction.to.toHexString(), event.transaction.hash);
  InternalHandleDeposit(basicInfo, event.params.user, event.params.amount,  event.params.token,  event.params.balance);
}

export function handleWithdraw(event: Withdraw): void {
  let basicInfo = CollectBasicInfo(event.address.toHexString(), event.block.timestamp, event.block.number, event.transaction.from.toHexString(), event.transaction.to.toHexString(), event.transaction.hash);
  InternalHandleWithdraw(basicInfo, event.params.user, event.params.amount,  event.params.token,  event.params.balance);
}

export function handleCancel(event: Cancel): void {
  let basicInfo = CollectBasicInfo(event.address.toHexString(), event.block.timestamp, event.block.number, event.transaction.from.toHexString(), event.transaction.to.toHexString(), event.transaction.hash);
    InternalHandleCancel(basicInfo, event.params.amountGet, event.params.amountGive, event.params.tokenGet, event.params.tokenGive, event.params.user, event.params.expires);
}
