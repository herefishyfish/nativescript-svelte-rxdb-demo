import { writable } from 'svelte/store';
import { createRxDatabase, lastOfArray } from 'rxdb';
import { LokiNativescriptAdapter } from '@herefishyfish/nativescript-lokijs-adapter';
import { replicateGraphQL } from 'rxdb/plugins/replication-graphql';
import { getRxStorageLoki } from 'rxdb/plugins/storage-lokijs';

import { heroSchema } from './schema';
import {
  pullQueryBuilder,
  pullStreamQueryBuilder,
  pushQueryBuilder,
} from './query-builder';

/**
 * RxDB ========================================================================
 */
const batchSize = 100;

function getCheckpoint(data: any[], lastCheckpoint) {
  const lastDoc = lastOfArray(data);
  return {
    id: lastDoc?.id ?? lastCheckpoint?.id ?? '',
    updatedAt:
      lastDoc?.updatedAt ??
      lastCheckpoint?.updatedAt ??
      new Date(0).toISOString(),
  };
}

let dbPromise;

const _create = async () => {
  console.log('_create');
  const db = await createRxDatabase({
    name: 'rxdbdemo',
    storage: getRxStorageLoki({
      env: 'NATIVESCRIPT',
      adapter: new LokiNativescriptAdapter(),
    }),
    multiInstance: false,
    ignoreDuplicate: true,
  });
  console.log('creating collections');
  await db.addCollections({ heroes: { schema: heroSchema } });
  dbPromise = db;
  console.log('db:', db);
  console.log('replication');
  const replicationState = replicateGraphQL<
    any,
    {
      id: string;
      updatedAt: string;
    }
  >({
    collection: db.heroes,
    url: {
      http: 'https://working-oriole-73.hasura.app/v1/graphql',
      ws: 'wss://working-oriole-73.hasura.app/v1/graphql',
    },
    push: {
      batchSize,
      queryBuilder: pushQueryBuilder,
      responseModifier: (response) => {
        return [];
      },
    },
    pull: {
      batchSize,
      queryBuilder: pullQueryBuilder,
      streamQueryBuilder: pullStreamQueryBuilder,
      responseModifier: (response, source, requestCheckpoint) => {
        return {
          checkpoint: getCheckpoint(response, requestCheckpoint),
          documents: response,
        };
      },
    },
    live: true,
    autoStart: true,
    waitForLeadership: false,
    deletedField: 'deleted',
  });

  replicationState.error$.subscribe((err) => {
    console.error('replication error:');
    console.dir(err);
  });

  return db;
};

export const db = () => (dbPromise ? dbPromise : _create());

/**
 * Svelte Writables ============================================================
 */

export const heroList = writable([]);
export const selectedHero = writable({});
export const name = writable('');
export const body = writable('');
