// столько строк в файле 13371826

const express = require('express') , cors = require('cors'), socket = require('socket.io'),
fs = require('fs'), sqlite = require('sqlite');


const dbPromise = sqlite.open('./database_lite.sqlite', { Promise });

/*
TEXT	"TEXT"
NUMERIC	"NUM"
INTEGER	"INT"
*/
// Sheme (reg TEXT, city TEXT, zip INT, log NUM, lat NUM, name TEXT)
(async () => {
  const db = await dbPromise;
  //await db.get('create table CA(reg TEXT, city TEXT, zip INT, log NUM, lat NUM, name TEXT)')
  var result = await db.all('select count(*) from CA')
  console.log(result);
})()

// const stream = fs.createReadStream('./CA.txt', 'utf-8');
//
//
// stream.on('data', e => {
//   const ob = e.split('\n');
//   for(o in ob){
//     (async (oo)=>{
//       const db = await dbPromise;
//       if(oo.length === 7){
//         const r = await db.get(
//           'INSERT INTO CA (reg, city, zip, log, lat, name) VALUES ('
//           + `'${oo[0]}', '${oo[1]}', ${oo[2]}, ${oo[3]}, ${oo[4]}, '${oo[5]}')`
//         );
//         //  'create table CA(reg TEXT, city TEXT, zip INT, log NUM, lat NUM, name TEXT)');
//         console.log(r)
//       }
//     })( ob[o].split(';') )
//     //ar[l] ? ar[l].q+=1 : ar[l]={q: 1, ex: ob[o].split(';')};
//   }
// })
//
// stream.on('end', ()=> {
//   console.log("done");
// })
