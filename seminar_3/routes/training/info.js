var express = require('express');
var router = express.Router();
const crypto = require('crypto-promise');
var json2csv = require('async-json2csv');
var csv = require("csvtojson");
const fs = require("fs");

const util = require('../../modules/utils');
const statusCode = require('../../modules/statusCode');
const resMessage = require('../../modules/responseMessage');

router.get('/:id',(req,res)=>{

    const csvToJson = (csvFilePath)=>{
        console.log(csvFilePath);
        return new Promise((resolve)=>{
          resolve(csv().fromFile(csvFilePath));
        })
    }
    //console.log(csv().fromFile('userInfo.csv'));;
    csvToJson('userInfo.csv')
    .then((jsonObj)=>{
        return new Promise((resolve,reject)=>{
            if(req.params.id==jsonObj[0].uid){
                resultObject={
                    id:jsonObj[0].uid,
                    name:jsonObj[0].uname,                                
                }
                resolve(resultObject);
            }else{
                reject("찾을수 없음");
            }
        })
    })
    .then((user)=>{
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.USER_SELECT_SUCCESS, user));  
    })
    .catch((message)=>{
           res.status(200).send(util.successTrue(statusCode.OK, resMessage.NO_USER, message));  
    })
   
})

router.post('/', async(req, res) => {
    console.log("req.body ",req.body);
    
    var userInfo={
        uid:" ",
        uname:" ",
        uage:" ",
    }
    if(req.body.id==''||req.body.name==''){
        console.log("학번 또는 이름이 없습니다.")
    }else{
        userInfo.uid=req.body.id;
        userInfo.uname=req.body.name;
        userInfo.uage=req.body.age;
        console.log("userInfo: ",userInfo);

        try {
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
        res.status(200).send(util.successTrue(statusCode.CREATED, resMessage.SAVE_SUCCESS));
        }catch(err){
            res.status(200).send(util.successTrue(statusCode.CREATED, resMessage.SAVE_FAIL));
        }

    }
  
});

module.exports = router;