/**
 * This file is in charge of building a controller (or set of controllers made up)
 * of the baseline logic you designed on your chaincode project, but replacing the logic
 * with your own for NodeJS. We inject here the `convector-adapter-fabric` which calls
 * the blockchain based on your own configuration.
 */
import { resolve } from 'path';
import { FabricControllerAdapter } from '@worldsibu/convector-adapter-fabric';
import { ClientFactory } from '@worldsibu/convector-core-adapter';
import { FinancialController } from 'financial-cc';
import { ParticipantController } from 'participant-cc';
import { SelfGenContext } from './selfGenContext';
import { ModelHelpers } from './convectorModels';
import {
  USER, CHANNEL,
  CHAINCODE, KEYSTORE, NETWORKPROFILE, ORG
} from '../utils';

async function InitFabricAdapter() {
  await SelfGenContext.getClient();

  const adapter = new FabricControllerAdapter({
    txTimeout: 300000,
    user: USER,
    // set it later to enable Mutual TLS
    channel: CHANNEL,
    chaincode: CHAINCODE,
    keyStore: KEYSTORE,
    networkProfile: NETWORKPROFILE,
    userMspPath: KEYSTORE
  });

  await adapter.init();
  return adapter;
}
/**
 * Building this adapter allows you to communicate with the
 * test env created by `hurley`.
 */
export async function InitFinancialController(): Promise<FinancialController> {
  return ClientFactory(FinancialController, await InitFabricAdapter());
}
export async function InitParticipantController(): Promise<ParticipantController> {
  return ClientFactory(ParticipantController, await InitFabricAdapter());
}
export async function InitServerIdentity() {
  const users = await ModelHelpers.getAllParticipants();
  if (!users.find(u => u.id === USER && u.msp === `${ORG}MSP`)) {
    console.log('Need to register server identity');
    // (await InitParticipantController()).register(USER);
    console.log('Server identity registered');
  } else {
    console.log('Server identity found');
  }
}