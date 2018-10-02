const
      //express = require('express') ,
      //cors = require('cors'),
      socket = require('socket.io'),
      //fs = require('fs'),
      sqlite = require('sqlite');
//
//
const server = require('http').createServer();
const dbPromise = sqlite.open('./database.sqlite', { Promise });

const io = require('socket.io')( server , {
  //path: '/test',
  //serveClient: false,
  // below are engine.IO options
  //pingInterval: 10000,
  //pingTimeout: 5000,
  //cookie: false,
  origins: '*:*'
});

io.on('connection', async socket => {
  const db = await dbPromise;
  this.requesting = false;
  //console.log(socket);
  socket.on('grab', async data => {
    console.log(data);
    if(!this.requesting){
      this.requesting = true;
      const zip = data.zip.trim().length ? `zip like '${data.zip}%'` : "",
            name = data.name.trim().length ? `name like '%${data.name}%'` : "",
            reg =  data.state.trim().length ? `reg like '${data.state}%'`: "",
            city = data.sity.trim().length ? `city like '${data.sity}%'` : "";
      let q = "";
      const ar = [ zip, name , reg , city ];

      for(let i=0;i<ar.length;i++){
        if(ar[i]){
          q+= q.length? " and "+ar[i] : " "+ar[i];
        }
      }
      if(q.length){
        q="where "+q;
      }
      //console.log(q);


      const cn = await db.all(`select count(*) from CA ${q}`);
      socket.emit("result_total" , cn );

      result = await db.all(`select * from CA ${q} limit 500 offset ${data.page || 0}`);
      socket.emit("result" , result );
      this.requesting = false;
    }
  })
});

const port = process.env.PORT || 3000;

server.listen( port , _=> console.log( "Server start on port", port ) );

// (async () => {
//   const db = await dbPromise;
//   var result = await db.all('select * from CA limit 100 offset 100')
//   //const res = await db.all('SELECT * FROM Category');
//   console.log(result);
// })()
