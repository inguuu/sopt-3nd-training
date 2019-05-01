var express = require('express');
var router = express.Router();
const crypto = require('crypto-promise');
var json2csv = require('async-json2csv');
const fs = require('fs');

const titleCheck =  require('../../modules/titleCheck');//중복 확인 모듈
const readCsv =  require('../../modules/readCsv');
const createdAt = require('../../modules/createdAt');

const util = require('../../modules/utils');
const statusCode = require('../../modules/statusCode');
const resMessage = require('../../modules/responseMessage');
//METHOD POST
router.post('/', async function(req, res, next) {
 
   
    let duplicate = await titleCheck(req.body);//제목 중복 확인  
    if(duplicate==true){
      res.status(200).send(util.successTrue(statusCode.OK, resMessage.DUPLICATED_TITLE));
    }else{

      let newItem={
        id:" ",
        title: " ",
        content: " ",
        createdAt: " ",
        hashedPw: " ",
        salt: " ",
      }
      let boardItems=await readCsv();
      console.log("boardItems", boardItems);

        const buf = await crypto.randomBytes(64);
        const salt= buf.toString('base64');
        const hashedPw= await crypto.pbkdf2(req.body.pw.toString(),salt,1000, 32, 'SHA512');
        
        newItem.id= req.body.id;
        newItem.title= req.body.title;
        newItem.content = req.body.content;
        newItem.createdAt = createdAt();
        newItem.hashedPw=hashedPw.toString('base64');
        newItem.salt= salt;
      
        boardItems.push(newItem);

        const options = { 
          data: boardItems,
          fields: ['id', 'title','content','createdAt','hashedPw','salt'],
          header: true
      }
          //console.log(options.data);
          const BoardCsv = await json2csv(options);
          await fs.writeFileSync('boardinfo.csv', BoardCsv);     
          res.status(200).send(util.successTrue(statusCode.OK, resMessage.SUCCESS_INPUT));
    }
});



//METHOD GET
router.get('/:id', async function(req, res, next) {
  let boardItems= await readCsv();
 // console.log(req.params.id);
  for(var i=0; i<boardItems.length;i++){
    if(req.params.id==boardItems[i].id){
      break;  
    }
  }
    if(i<boardItems.length){
      console.log("조회 성공");
      res.status(200).send(util.successTrue(statusCode.OK, resMessage.SUCCESS_BOARD,boardItems[i]));
    }else{
      console.log("조회 실패");
      res.status(200).send(util.successFalse(statusCode.OK,resMessage.NO_ID));
    }
  
});

//METHOD PUT
router.put('/', async function(req, res, next) {
  let boardItems= await readCsv();
  for(var i=0; i<boardItems.length;i++){
    if(req.body.id==boardItems[i].id){
      break;  
    }
  }
    if(i<boardItems.length){
      let duplicate = await titleCheck(req.body);//제목 중복 확인  
      if(duplicate==true){
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.DUPLICATED_TITLE));
      }
      else{
        const salt= boardItems[i].salt;
        const hashedPw= await crypto.pbkdf2(req.body.pw.toString(),salt,1000, 32, 'SHA512');
        // console.log("salt:",salt)
        // console.log("boardItems[i].salt:",boardItems[i].salt)
        // console.log("hashedPw:",hashedPw)
        // console.log("boardItems[i].hashedPw",boardItems[i].hashedPw)
        if(boardItems[i].hashedPw==hashedPw.toString('base64')){//비밀번호 확인
          boardItems[i].title= req.body.title;
          boardItems[i].content = req.body.content;
          boardItems[i].createdAt = createdAt();
          boardItems[i].hashedPw=hashedPw.toString('base64');
          boardItems[i].salt= salt;
    
          const options = { 
            data: boardItems,
            fields: ['id', 'title','content','createdAt','hashedPw','salt'],
            header: true
          }
          const BoardCsv = await json2csv(options);
          await fs.writeFileSync('boardinfo.csv', BoardCsv); 
  
        console.log("수정 성공");
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.SUCCESS_MODIFY,boardItems[i]));
        
        }else{
          console.log("비밀번호 오류");
          res.status(200).send(util.successFalse(statusCode.OK,resMessage.PASSWORD_NOT_CORRECT));
        }
     }
    }else{
      console.log("수정 실패");
      res.status(200).send(util.successFalse(statusCode.OK,resMessage.NO_ID));
    }
});

//METHOD DELETE
router.delete('/', async function(req, res, next) {
  let boardItems= await readCsv();
  for(var i=0; i<boardItems.length;i++){
    if(req.body.id==boardItems[i].id){
      break;  
    }
  }

  if(i<boardItems.length){

    const salt= boardItems[i].salt;
    const hashedPw= await crypto.pbkdf2(req.body.pw.toString(),salt,1000, 32, 'SHA512');
    if(boardItems[i].hashedPw==hashedPw.toString('base64')){//비밀번호 확인
      boardItems.splice(i,1);
      const options = { 
        data: boardItems,
        fields: ['id', 'title','content','createdAt','hashedPw','salt'],
        header: true
      }
        const BoardCsv = await json2csv(options);
        await fs.writeFileSync('boardinfo.csv', BoardCsv); 
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.SUCCESS_DELETE));
        console.log("삭제 성공");
      }else{
        console.log("비밀번호 오류");
        res.status(200).send(util.successFalse(statusCode.OK,resMessage.PASSWORD_NOT_CORRECT));
      }

    }else{
      console.log("삭제 실패");
      res.status(200).send(util.successFalse(statusCode.OK,resMessage.NO_ID));
    }

  });

module.exports = router;