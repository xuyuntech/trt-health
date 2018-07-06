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
  const registry_RegisterHistory = await getAssetRegistry('org.xuyuntech.health.RegisterHistory');
  await registry_RegisterHistory.update(item);

}
/**
 * 更新挂号单状态: Visiting -> Finish
 * @param {org.xuyuntech.health.FinishRegisterAction} tx - the visiting to be processed
 * @transaction
 */
async function finishRegisterHistoryAction(tx){
  var factory = getFactory();
  var NS = 'org.xuyuntech.health';
  var date = new Date();
  const item = tx.registerHistory;
  console.log('verifyRegisterHistoryAction:', item);
  const patient = tx.registerHistory.patient;
  // TODO 校验 state 必须为 Visiting
  if (item.state !== 'Visiting') {
    throw new Error('the state is not visiting');
  }
  //病例创建
  // var key = patient.name + date.toLocaleDateString();
  var CaseItem = factory.newResource(NS, 'CaseItem', tx.id);
  CaseItem.complained = tx.complained;
  CaseItem.diagnose = tx.diagnose;
  CaseItem.history = tx.history;
  CaseItem.familyHistory = tx.familyHistory;
  CaseItem.created = tx.created;
  let assetRegistry_CaseItem = await getAssetRegistry(NS + '.CaseItem');
  await assetRegistry_CaseItem.addAll([CaseItem]);
  //处方创建
  var Prescription = factory.newResource(NS, 'Prescription', tx.id);
  Prescription.created = tx.created;
  Prescription.registerHistory = item;
  Prescription.caseItem = factory.newRelationship(NS, 'CaseItem', tx.id);
  let assetRegistry_Prescription = await getAssetRegistry(NS + '.Prescription');
  await assetRegistry_Prescription.addAll([Prescription]);

  item.state = 'Finished';
  const registry = await getAssetRegistry('org.xuyuntech.health.RegisterHistory');
  await registry.update(item);

  patient.points += tx.points;
  const registry_Patient = await getParticipantRegistry('org.xuyuntech.health.Patient');
  await registry_Patient.update(patient);
}