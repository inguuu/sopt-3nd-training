const crypto = require('crypto-promise');
var json2csv = require('async-json2csv');
const fs = require('fs');

async function writeCsv(boardItems){
  
    const options = { 
        data: boardItems,
        fields: ['id', 'title','content','createdAt','hashedPw','salt'],
        header: true
    }
        //console.log(options.data);
        const BoardCsv = await json2csv(options);
        await fs.writeFileSync('boardinfo.csv', BoardCsv);     
    
 }
 
 
 module.exports=writeCsv;