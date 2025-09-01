/* eslint-disable no-undef */
// script.js
// Example K6 load test script
import http from "k6/http";
import { check } from "k6";

export const options = {
  // number of changes
  vus: 40,

  // how long
  duration: "1m",

  // setting thresholds for when the load test is considered to "pass/fail"
  thresholds: {
    // Hard fail if >=1% of requests are errors (HTTP >=400 or network)
    http_req_failed: [
      { threshold: "rate<0.01", abortOnFail: true, delayAbortEval: "0s" },
    ],
    // Hard fail if business check (non-empty array) drops below 99%
    checks: [
      { threshold: "rate>0.99", abortOnFail: true, delayAbortEval: "0s" },
    ],
  },
};

// Configure via env vars or fall back to your provided values
const TARGET_URL =
  __ENV.TARGET_URL ||
  "https://lgibbrusblxcnpwkhfxf.supabase.co/functions/v1/getSharedTasks";
const TOKEN =
  __ENV.TOKEN ||
  "supabase_anon_token should go here, but you can use an env variable";

const params = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export default function () {
  const res = http.get(TARGET_URL, params);

  // check wether the data of the commit can be verified.
  // in this case we check:
  // -  wether it can be serialized to JSON
  // -  Wether it is an array
  // -  Wether it is non-empty (length > 0)
  let ok = false;
  try {
    const data = res.json(); // throws if not JSON
    ok = Array.isArray(data) && data.length > 0;
  } catch {
    ok = false;
  }

  // Single “business” check so the checks rate reflects exactly this condition
  check(res, {
    "response is non-empty array": () => ok,
  });
}
