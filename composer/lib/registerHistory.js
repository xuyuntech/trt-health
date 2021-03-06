'use strict';

/**
 * 更新挂号单状态: Register -> Visiting
 * @param {org.xuyuntech.health.RegisterAction} tx - the visiting to be processed
 * @transaction
 */
async function createRegisterHistoryAction(tx){
  const item = tx.registerHistory;
  console.log('createRegisterHistoryAction:', item);
  const registry = await getAssetRegistry('org.xuyuntech.health.RegisterHistory');
  await registry.add(item);
}

/**
 * 更新挂号单状态: Register -> Visiting
 * @param {org.xuyuntech.health.VerifyRegisterAction} tx - the visiting to be processed
 * @transaction
 */
async function verifyRegisterHistoryAction(tx){
  const item = tx.registerHistory;
  console.log('verifyRegisterHistoryAction:', item);
  item.state = 'Visiting';
  const registry = await getAssetRegistry('org.xuyuntech.health.RegisterHistory');
  await registry.update(item);
}
/**
 * 更新挂号单状态: Visiting -> Finish
 * @param {org.xuyuntech.health.FinishRegisterAction} tx - the visiting to be processed
 * @transaction
 */
async function finishRegisterHistoryAction(tx){
  const item = tx.registerHistory;
  console.log('verifyRegisterHistoryAction:', item);
  // TODO 校验 state 必须为 Visiting
  item.state = 'Finished';
  const registry = await getAssetRegistry('org.xuyuntech.health.RegisterHistory');
  await registry.update(item);
}