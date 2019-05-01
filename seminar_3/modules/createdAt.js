function createdAt(){
    var now = new Date();

    var createdAt = now.getFullYear()+"-"+now.getDay()+"-"+now.getDate()+" "
    +now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();

    //console.log(createdAt);
    return createdAt;
}
module.exports=createdAt;