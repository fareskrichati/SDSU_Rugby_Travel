import test from 'node:test';
import assert from 'node:assert/strict';
import {featuredMatch,upcomingMatches,matchLabel,mapLinks,todayInSanDiego,daysUntilMatch} from '../lib/matches.ts';
const trip=(id,date,extra={})=>({id,date,...extra});
test('features the nearest future match regardless of insertion order',()=>{const {trip:t,label}=featuredMatch([trip('later','2027-03-01'),trip('past','2026-11-01'),trip('next','2026-12-05')],'2026-11-21');assert.equal(t.id,'next');assert.equal(label,'Next match');});
test('today is match day, past matches are never labeled upcoming',()=>{assert.equal(featuredMatch([trip('today','2026-11-21')],'2026-11-21').label,'Match day');assert.equal(featuredMatch([trip('past','2026-11-01')],'2026-11-21').label,'Most recent match');assert.equal(upcomingMatches([trip('past','2026-11-01')],'2026-11-21').length,0);});
test('undated match is shown with an honest date-pending label',()=>{const result=featuredMatch([trip('past','2026-11-01'),trip('pending','')],'2026-11-21');assert.equal(result.trip.id,'pending');assert.equal(result.label,'Date to be confirmed');assert.equal(featuredMatch([],'2026-11-21').trip,undefined);});
test('home toggle and explicit match location both label home matches',()=>{assert.equal(matchLabel(trip('a','',{packet:{homeEnabled:true}})),'Home match');assert.equal(matchLabel(trip('a','',{matchType:'home'})),'Home match');assert.equal(matchLabel(trip('a','')),'Away match');});
test('map links safely preserve a full address with punctuation',()=>{const address='5500 Campanile Dr, San Diego, CA & Gate 2';const links=mapLinks(address);assert.equal(new URL(links.google).searchParams.get('query'),address);assert.equal(new URL(links.google).searchParams.get('api'),'1');assert.equal(new URL(links.apple).searchParams.get('q'),address);});
test('upcoming dates use San Diego time near midnight UTC',()=>{assert.equal(todayInSanDiego(new Date('2026-11-22T02:00:00Z')),'2026-11-21');});

test('countdown uses calendar days across DST and handles today and tomorrow',()=>{assert.equal(daysUntilMatch('2027-02-06','2026-11-21'),77);assert.equal(daysUntilMatch('2027-03-15','2027-03-13'),2);assert.equal(daysUntilMatch('2026-11-21','2026-11-21'),0);assert.equal(daysUntilMatch('2026-11-22','2026-11-21'),1);});
test('countdown is hidden for past, missing, or invalid dates',()=>{assert.equal(daysUntilMatch('2026-11-20','2026-11-21'),null);assert.equal(daysUntilMatch('','2026-11-21'),null);assert.equal(daysUntilMatch('2027-02-30','2026-11-21'),null);assert.equal(daysUntilMatch('2027-02-06',''),null);});
