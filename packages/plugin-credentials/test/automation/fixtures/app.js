/**!
 *
 * Copyright (c) 2015-2016 Cisco Systems, Inc. See LICENSE file.
 * @private
 */

/* eslint-env browser */

import '../..';
import StorageAdapterLocalStorage from '@ciscospark/storage-adapter-local-storage';
import Spark from '@ciscospark/spark-core';

const spark = window.spark = new Spark({
  config: {
    storage: {
      boundedAdapter: new StorageAdapterLocalStorage(`ciscospark`)
    }
  }
});

document.body.classList.add(`ready`);

document.getElementById(`initiate-implicit-grant`).addEventListener(`click`, () => {
  spark.credentials.initiateLogin();
});

document.getElementById(`initiate-authorization-code-grant`).addEventListener(`click`, () => {
  spark.config.credentials.clientType = `confidential`;
  spark.credentials.initiateLogin();
});

document.getElementById(`token-refresh`).addEventListener(`click`, () => {
  document.getElementById(`access-token`).innerHTML = ``;
  spark.refresh({force: true})
    .then(() => {
      document.getElementById(`access-token`).innerHTML = spark.credentials.supertoken.access_token;
      document.getElementById(`refresh-token`).innerHTML = spark.credentials.supertoken.refresh_token;
    });
});

document.getElementById(`logout`).addEventListener(`click`, () => {
  spark.logout();
});

spark.listenToAndRun(spark, `change:canAuthorize`, () => {
  if (!spark.canAuthorize) {
    return;
  }

  document.getElementById(`access-token`).innerHTML = spark.credentials.supertoken.access_token;
  document.getElementById(`refresh-token`).innerHTML = spark.credentials.supertoken.refresh_token;

  spark.request({
    uri: `https://locus-a.wbx2.com/locus/api/v1/ping`
  })
    .then(() => {
      document.getElementById(`ping-complete`).innerHTML = `success`;
    });
});
