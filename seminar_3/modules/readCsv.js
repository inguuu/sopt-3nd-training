var csv = require("csvtojson");
const fs = require("fs");


async function readCsv(){
   var BoardItems =[];
    await csv()
    .fromFile('./boardinfo.csv')
    .then((jsonObj)=>{
        for (var i = 0; i < jsonObj.length; i++) {
          BoardItems.push(jsonObj[i]);
        }
    })
    return BoardItems;
    
   
}


module.exports=readCsv;