import test from 'node:test';
import assert from 'node:assert/strict';
import {hasSameOrigin} from '../lib/packet-security.mjs';
const request=(origin,host)=>({headers:new Headers({...origin&&{origin},...host&&{host}})});
test('same-origin validation works with production hosts and local ports',()=>{assert.equal(hasSameOrigin(request('https://rugby.fareskrichati.com','rugby.fareskrichati.com')),true);assert.equal(hasSameOrigin(request('http://127.0.0.1:3007','127.0.0.1:3007')),true);});
test('foreign, missing, malformed, and wrong-port origins are rejected',()=>{assert.equal(hasSameOrigin(request('https://attacker.example','rugby.fareskrichati.com')),false);assert.equal(hasSameOrigin(request(null,'rugby.fareskrichati.com')),false);assert.equal(hasSameOrigin(request('null','rugby.fareskrichati.com')),false);assert.equal(hasSameOrigin(request('http://127.0.0.1:3008','127.0.0.1:3007')),false);});
