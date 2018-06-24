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
 *  Register -> Visiting
 * @param {org.xuyuntech.health.visiting} visiting - the visiting to be processed
 * @transaction
 */
async function visiting(visiting){
    visiting.registerHistory.state = 'Visiting';
    let assetRegistry = await getAssetRegistry('org.xuyuntech.health.RegisterHistory');
    await assetRegistry.update(visiting.registerHistory);
}
/**
 *  incerase Prescribe
 * @param {org.xuyuntech.health.Prescribe} Prescribe - the Prescribe to be processed
 * @transaction
 */
async function Prescribe(Prescribe){
    if (Prescribe.registerHistory.state !== 'Visiting') {
        throw new Error('the state is not visiting');
    }
    var factory = getFactory();
    var NS = 'org.xuyuntech.health';

    //create the CaseItem
    var CaseItem = factory.newResource(NS, 'CaseItem', Prescribe.participantKey_CaseItem);
    CaseItem.patient = Prescribe.registerHistory.patient;
    CaseItem.doctor = Prescribe.registerHistory.arrangementHistory.doctor;
    CaseItem.hospital = Prescribe.registerHistory.arrangementHistory.hospital;
    CaseItem.complained = Prescribe.complained;
    CaseItem.number = Prescribe.participantKey_CaseItem;
    CaseItem.diagnose = Prescribe.diagnose;
    CaseItem.history = Prescribe.history;
    CaseItem.familyHistory = Prescribe.familyHistory;
    CaseItem.created = Prescribe.created;


    // var growerAddress = factory.newConcept(NS, 'Address');
    // growerAddress.country = 'USA';
    // grower.address = growerAddress;
    // grower.accountBalance = 0;
    // CaseItem.patient = factory.newRelationship(NS, 'Patient', Prescribe.patient);
    // CaseItem.doctor = factory.newRelationship(NS, 'Doctor', Prescribe.doctor);
    // CaseItem.hospital = factory.newRelationship(NS, 'Hospital', Prescribe.hospital);

    //create the Prescription
    // o String participantKey
    // o String number // 处方编号
    // o DateTime created // 创建时间
    // --> Doctor doctor // 医师
    // --> Patient patient // 患者
    // --> MedicalItem[] medicalItems // 药品列表
    // --> RegisterHistory registerHistory // 挂号记录
    // --> CaseItem caseItem // 病历

    var Prescription = factory.newResource(NS, 'Prescription', Prescribe.participantKey_Prescription);
    Prescription.number =  Prescribe.participantKey_Prescription;
    Prescription.created = Prescribe.created;
    Prescription.doctor = Prescribe.registerHistory.arrangementHistory.doctor;
    Prescription.patient = Prescribe.registerHistory.patient;
    if (Prescribe.medicalItems.length !== 0 && Prescribe.count.length === 0) {
        throw new Error('you must input the medical count');
    }
    if (Prescribe.medicalItems.length !== Prescribe.count.length) {
        throw new Error('you hava some medical count not input ');
    }
    Prescription.medicalItems = Prescribe.medicalItems;
    Prescription.count = Prescribe.count;
    Prescription.registerHistory = Prescribe.registerHistory;
    Prescription.caseItem = factory.newRelationship(NS, 'CaseItem', Prescribe.participantKey_CaseItem);


    //生成订单以及订单明细
    //订单明细
    // o String participantKey
    // o String number // 编号
    // --> MedicalItem medicalItem
    // o Double count // 购买数量
    // o Double price // 单价
    // o Double spending // 消费金额
    var spending_all = 0;
    for (let index = 0; index < Prescribe.medicalItems.length; index++) {
        var OrderItem = factory.newResource(NS, 'OrderItem', Prescribe.participantKey_OrderItem + '_' + index.toString());
        OrderItem.number = Prescribe.participantKey_OrderItem + '_' +index.toString();
        OrderItem.medicalItem = Prescribe.medicalItems[index];
        OrderItem.count = Prescribe.count[index];
        OrderItem.price = Prescribe.price[index];
        OrderItem.spending = Prescribe.count[index] * Prescribe.price[index];
        spending_all += Prescribe.count[index] * Prescribe.price[index];
        let assetRegistry_OrderItem = await getAssetRegistry(NS + '.OrderItem');
        await assetRegistry_OrderItem.addAll([OrderItem]);
    }

    //订单
    // o String participantKey
    // o String number // 订单编号
    // o OrderState state
    // o DateTime created
    // o Double spending // 总金额
    // --> OrderItem[] orderItem // 订单明细
    // --> Prescription prescription
    // --> RegisterHistory registerHistory
    // --> Patient patient
    // --> CaseItem caseItem
    var Order = factory.newResource(NS, 'Order', Prescribe.participantKey_Order);
    Order.number = Prescribe.participantKey_Order;
    Order.state = Prescribe.orderstate;
    Order.created = Prescribe.created;
    Order.spending = spending_all;
    var item = [];
    for (let index = 0; index < Prescribe.medicalItems.length; index++) {
        item.push(factory.newRelationship(NS, 'OrderItem',Prescribe.participantKey_OrderItem + '_' +index.toString()));
    }
    Order.orderItem  = item;
    Order.prescription = factory.newRelationship(NS,'Prescription',Prescribe.participantKey_Prescription);
    Order.registerHistory = Prescribe.registerHistory;
    Order.patient = Prescribe.registerHistory.patient;
    Order.caseItem = factory.newRelationship(NS, 'CaseItem', Prescribe.participantKey_CaseItem);


    //更新挂号单状态 Visiting -> Finished
    Prescribe.registerHistory.state = 'Finished';


    //上传更新
    //CaseItem
    let assetRegistry_CaseItem = await getAssetRegistry(NS + '.CaseItem');
    await assetRegistry_CaseItem.addAll([CaseItem]);
    //Prescription
    let assetRegistry_Prescription = await getAssetRegistry(NS + '.Prescription');
    await assetRegistry_Prescription.addAll([Prescription]);
    //order
    let assetRegistrystate_order = await getAssetRegistry(NS + '.Order');
    await assetRegistrystate_order.addAll([Order]);
    //state
    let assetRegistrystate_state = await getAssetRegistry('org.xuyuntech.health.RegisterHistory');
    await assetRegistrystate_state.update(Prescribe.registerHistory);



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
    // for (let n = 0; n < finish.medicalItems.length; n++) {
    //     finish.medicalItems[n].quantity -= finish.order.orderItem[n].count;
    //     let assetRegistry = await getAssetRegistry('org.xuyuntech.health.MedicalItem');
    //     await assetRegistry.update( finish.medicalItems[n]);

    // }
    for (let n = 0; n < finish.order.orderItem.length; n++) {
        finish.order.orderItem[n].medicalItem.quantity = finish.order.orderItem[n].medicalItem.quantity - finish.order.orderItem[N].count;
        // finish.medicalItems[n].quantity = finish.medicalItems[n].quantity - finish.order.orderItem.count;
        let asset_Quantity = await getAssetRegistry('org.xuyuntech.health.MedicalItem');
        await asset_Quantity.update(finish.order.orderItem[n].medicalItem);
    }
}