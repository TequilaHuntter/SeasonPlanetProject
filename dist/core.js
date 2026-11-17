(function(root){
const keys=['oxygen','water','temperature','fertility'];
const names=['氧泡草','蓄水苔','凉风蕨','沃土菇','星米','月铃花'];
const seeds=names.map((name,i)=>({id:'seed_00'+(i+1),name,price:[15,15,15,15,8,25][i],sell:[5,5,5,5,4,12][i],yield:i===4?3:2,range:i===5?[[40,75],[40,75],[30,65],[35,85]]:keys.map(()=>[0,100]),delta:keys.map((_,k)=>i===k?(k===2?-6:8):0),seasons:[0,1,2,3],icon:['♧','❋','❧','♠','♣','✿'][i]}));
const initial=[20,25,65,15],ideal=[[45,65],[45,65],[45,60],[45,70]];
const score=e=>e.reduce((s,v,i)=>s+Math.max(0,Math.min(1,v<ideal[i][0]?v/ideal[i][0]:v>ideal[i][1]?(100-v)/(100-ideal[i][1]):1))/4,0);
function fresh(){return {version:1,rev:0,coins:100,env:[...initial],plots:[null,null,null,null],seeds:Array(6).fill(0),crops:Array(6).fill(0),season:0,round:0,elapsed:0,duration:1800000,phase:'ready',log:'欢迎来到你的第一颗星球。先点击土地，再购买并种下植物。'};}
const value=s=>Math.floor(500*Math.max(0,(score(s.env)-score(initial))/(1-score(initial))));
const suitable=(s,i)=>seeds[i].seasons.includes(s.season)&&seeds[i].range.every(([lo,hi],k)=>s.env[k]>=lo&&s.env[k]<=hi);
function settle(s){if(s.elapsed<s.duration||!['running','paused'].includes(s.phase))throw Error('本季尚未完成');const n=JSON.parse(JSON.stringify(s)),delta=[0,0,0,0],gains=[];n.plots.forEach(i=>{if(i!==null&&suitable(s,i)){n.crops[i]+=seeds[i].yield;seeds[i].delta.forEach((v,k)=>delta[k]+=v);gains.push(seeds[i].name+' ×'+seeds[i].yield);}});n.env=n.env.map((v,k)=>Math.max(0,Math.min(100,v+delta[k])));n.round++;n.season=(n.season+1)%4;n.phase='ready';n.elapsed=0;n.log='第 '+n.round+' 季完成 · '+(gains.join('，')||'本季无收获')+'。生态变化：'+delta.map((v,k)=>['氧气','水分','温度','丰饶'][k]+(v>=0?'+':'')+v).join(' / ');return n;}
function validate(s){return s&&s.version===1&&Number.isInteger(s.rev)&&s.rev>=0&&Number.isInteger(s.coins)&&s.coins>=0&&Array.isArray(s.env)&&s.env.length===4&&s.env.every(v=>Number.isFinite(v)&&v>=0&&v<=100)&&['seeds','crops'].every(k=>Array.isArray(s[k])&&s[k].length===6&&s[k].every(v=>Number.isInteger(v)&&v>=0))&&Array.isArray(s.plots)&&s.plots.length===4&&s.plots.every(v=>v===null||Number.isInteger(v)&&v>=0&&v<6)&&Number.isInteger(s.season)&&s.season>=0&&s.season<4&&Number.isInteger(s.round)&&s.round>=0&&[10000,1800000].includes(s.duration)&&Number.isFinite(s.elapsed)&&s.elapsed>=0&&s.elapsed<=s.duration&&['ready','running','paused'].includes(s.phase)&&typeof s.log==='string';}
root.SP={keys,seeds,initial,ideal,fresh,value,suitable,settle,validate};
})(typeof module==='object'?module.exports:window);
