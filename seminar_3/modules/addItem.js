const crypto = require('crypto-promise');
var json2csv = require('async-json2csv');
var csv = require("csvtojson");
const fs = require("fs");
const readCsv =  require('./readCsv');

async function additem(item){

    var boardItem=readCsv();
        userInfo.uid=req.body.id;
        userInfo.uname=req.body.name;
        userInfo.uage=req.body.age;
        console.log("userInfo: ",userInfo);

        const buf = await crypto.randomBytes(64);
        console.log("buf: ",buf);
        const salt= buf.toString('base64');
        console.log("salt: ",salt)

        const hashedAge= await crypto.pbkdf2(userInfo.uage.toString(),salt,1000, 32, 'SHA512');
        console.log("hashedAge: ",hashedAge);
        console.log("hashedAge.toString: ",hashedAge.toString('base64'));
        console.log("나이 암호화 성공");
        userInfo.uage=hashedAge.toString('base64');

        const options = { 
            data: [userInfo],
            fields: ['uid', 'uname','uage'],
            /*필드값에 변수와 userInfo 변수 값이 맞아야 자동으로 짝을 지어준다.  
            userInfo가 uid인데 필드값이 id면 안됨*/
            header: true
        }
        console.log(options.data);
        const InfoCsv = await json2csv(options);

        console.log(InfoCsv);
        await fs.writeFileSync('userInfo.csv', InfoCsv);        
    
    
}

module.exports=additem;