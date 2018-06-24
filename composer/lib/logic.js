/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * Track the trade of a commodity from one trader to another
 * @param1 {org.xuyuntech.health.Trade} trade - the trade to be processed
 * @transaction1
 */
// async function tradeCommodity(trade) {

//     // set the new owner of the commodity
//     trade.commodity.owner = trade.newOwner;
//     let assetRegistry = await getAssetRegistry('org.xuyuntech.health.Commodity');

//     // emit a notification that a trade has occurred
//     let tradeNotification = getFactory().newEvent('org.xuyuntech.health', 'TradeNotification');
//     tradeNotification.commodity = trade.commodity;
//     emit(tradeNotification);

//     // persist the state of the commodity
//     await assetRegistry.update(trade.commodity);
// }

/**
 * Remove all high volume commodities
 * @param1 {org.xuyuntech.health.RemoveHighQuantityCommodities} remove - the remove to be processed
 * @transaction1
 */
// async function removeHighQuantityCommodities(remove) {

//     let assetRegistry = await getAssetRegistry('org.xuyuntech.health.Commodity');
//     let results = await query('selectCommoditiesWithHighQuantity');

//     for (let n = 0; n < results.length; n++) {
//         let trade = results[n];

//         // emit a notification that a trade was removed
//         let removeNotification = getFactory().newEvent('org.xuyuntech.health','RemoveNotification');
//         removeNotification.commodity = trade;
//         emit(removeNotification);
//         await assetRegistry.remove(trade);
//     }
// }


/**
 * 更新挂号单状态: Register -> Visiting
 * @param {org.xuyuntech.health.visiting} visiting - the visiting to be processed
 * @transaction
 */
async function UpdateRegister(visiting){
    visiting.registerHistory.state = 'Visiting';
    let assetRegistry = await getAssetRegistry('org.xuyuntech.health.RegisterHistory');
    await assetRegistry.update(visiting.registerHistory);
}

/**
 * 支付: 更新订单状态 NotPaid -> Paid ，生成支付记录
 * @param {org.xuyuntech.health.paid} paid - the paid to be processed
 * @transaction
 */
async function UpdateOrder1(paid){

    // 更新订单状态 NotPaid -> Paid
    paid.order.state = 'Paid';
    let asset_Registry = await getAssetRegistry('org.xuyuntech.health.Order');
    await asset_Registry.update(paid.order);

    var factory = getFactory();
    var NS = 'org.xuyuntech.health';

    // 生成支付记录
    var PaymentHistory = factory.newResource(NS, 'PaymentHistory', paid.participantKey_paid);
    PaymentHistory.number = paid.number;
    PaymentHistory.spending = paid.order.spending;
    PaymentHistory.created = paid.created;
    PaymentHistory.order = paid.order;
    PaymentHistory.prescription = paid.prescription;
    PaymentHistory.registerHistory = paid.registerHistory;
    PaymentHistory.patient = paid.registerHistory.patient;

    let assetRegistry_PaymentHistory = await getAssetRegistry(NS + '.PaymentHistory');
    await assetRegistry_PaymentHistory.addAll([PaymentHistory]);

    // let totalSpend = 0;
    // for (let n = 0; n < paid.order.orderItem.length; n++) {
    //     totalSpend = totalSpend + paid.order.orderItem[n].count * paid.order.orderItem[n].price;
    //     // totalSpend = totalSpend + paid.order.orderItem[n].spending;
    // }

    // paid.paymentHistory.spending = totalSpend;

    // let assetPaymentHistory = await getAssetRegistry('org.xuyuntech.health.PaymentHistory');
    // await assetPaymentHistory.update(paid.paymentHistory);
}

/**
 * 取药: 更新订单状态 Paid -> Finished, 生成出库记录
 * @param {org.xuyuntech.health.finish} finish - the finish to be processed
 * @transaction
 */
async function UpdateOrder2(finish){

    // 更新订单状态 Paid -> Finished
    finish.order.state = 'Finished';
    let assetRegistry = await getAssetRegistry('org.xuyuntech.health.Order');
    await assetRegistry.update(finish.order);

    var factory = getFactory();
    var NS = 'org.xuyuntech.health';

    // 生成出库记录
    var OutboundHistory = factory.newResource(NS, 'OutboundHistory', finish.participantKey_finish);
    OutboundHistory.number = finish.number;
    OutboundHistory.outboundTime = finish.outboundTime;
    OutboundHistory.order = finish.order;
    OutboundHistory.prescription = finish.prescription;
    OutboundHistory.registerHistory = finish.registerHistory;
    OutboundHistory.medicalItems = finish.medicalItems;

    let asset_OutboundHistory = await getAssetRegistry(NS + '.OutboundHistory');
    await asset_OutboundHistory.addAll([OutboundHistory]);

    // 更新库存
    for (let n = 0; n < finish.order.orderItem.length; n++) {
        finish.order.orderItem[n].medicalItem.quantity = finish.order.orderItem[n].medicalItem.quantity - finish.order.orderItem.count;
        // finish.medicalItems[n].quantity = finish.medicalItems[n].quantity - finish.order.orderItem.count;
        let asset_Quantity = await getAssetRegistry('org.xuyuntech.health.MedicalItem');
        await asset_Quantity.update(finish.order.orderItem[n].medicalItem);
    }

    // let asset_Quantity = await getAssetRegistry('org.xuyuntech.health.MedicalItem');
    // await asset_Quantity.update(finish.medicalItems);

    // for (let n = 0; n < finish.order.orderItem.length; n++) {
    //     let oldQuantity = finish.order.orderItem[n].medicalItem.quantity;
    //     finish.order.orderItem[n].medicalItem.quantity = oldQuantity - finish.order.orderItem.count;

    //     let assetQuantity = await getAssetRegistry('org.xuyuntech.health.MedicalItem');
    //     await assetQuantity.update(finish.medicalItem[n]);
    // }
    // let assetQuantity = await getAssetRegistry('org.xuyuntech.health.MedicalItem');
    // await assetQuantity.update(finish.medicalItem);
}