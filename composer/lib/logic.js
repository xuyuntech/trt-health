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
