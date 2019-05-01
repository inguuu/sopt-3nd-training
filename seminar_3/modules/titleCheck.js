var csv = require("csvtojson");
const fs = require("fs");

async function titleCheck(item){
    var value=false;
    await csv()
    .fromFile('./boardinfo.csv')
    .then((jsonObj)=>{
        for (var i = 0; i < jsonObj.length; i++) {
          
            if (jsonObj[i].title == item.title) {
                value = true;
                console.log("중복된 제목이 있음");
                break;
            }
        }
    })
    return value;
    
   
}


module.exports=titleCheck;