const mysql = require("./mysqlConnect");
//const  AnoMesFiltro  = require("../controllers/movimentController");

get= async (query)=>{
    if(query){
    query = JSON.parse(query);
    sql= "SELECT ";
    if(query.select.date){
        sql+="date, ";
    }
    if(query.select.description){
        sql+="description, ";
    }
    if(query.select.value){
        sql+="value, ";
    }
    if(query.select.type){
        sql+="type, ";
    }
}
    sql=sql.substring(0, sql.length - 2);//remover dois ultimos caracter da sctring
    sql+=" FROM moviment"
    /*if(query.where){
        sql+=" WHERE"
        query.where.forEach(item =>{
            sql+=" "+item.campo+" "+item.operador.replace('/', '')+" '"+item.value+"' AND";
        })
        sql=sql.substring(0, sql.length - 3);//remover utilmo segmento 'END' da string
    } */
    return await  mysql.query(sql);
}

post= async (date, idUser)=>{
    sql="INSERT INTO moviment"
    +" (description, date, value, user_id, type)"
    +" VALUES "
    +"('"+date.description+"', '"+date.date+"', "+date.value+", "+idUser+", '"+date.type+"')";
    const result = await  mysql.query(sql);
    if(result){
        resp={"status":"OK",insertId:result.insertId};
    }else{
        resp={"status":"Error",insertId:result.insertId};
    }
    return resp;
 }

 put= async (date, idUser)=>{
     sql="UPDATE moviments SET "
     +"description='"+date.description+"', date= '"+date.date+"', value="+date.value+", user_id="+idUser+", type='"+date.type+"'" 
     +" WHERE id= "+date.id
    const result = await  mysql.query(sql);
    resp=null;
    if(result){
        resp={"status":"OK"};
    }
    return resp;
 }

 remove = async (idMov, idUser)=>{
    sql="DELETE INTO moviments"
    +" WHERE id="+idMov;
    const result = await  mysql.query(sql);
    resp=null;
    if(result){
        resp={"status":"OK"};
    }
    return resp;
 }


 /*GET    /chashbook/cashbalance  ->Retornar objeto contendo os valores equivaletes as entradas , saidas e saldo do caixa.*/
 cashbalance = async () => {
    input = "SELECT sum(value) AS input FROM moviment WHERE type='input'";
    output = "SELECT sum(value) AS output FROM moviment WHERE type='output'";
    const resultinput = await mysql.query(input);
    const resultoutput = await mysql.query(output);
    total = parseFloat(resultinput[0].input) - parseFloat(resultoutput[0].output);
    resp = null;
    if(resultinput && resultoutput){
        resp = { cashbalance: total, input: resultinput[0].input, output: resultoutput[0].output};
    }
    return resp;
 }

/*GET   /cashbook/io  -> Retornar objeto contendo os valores totais de entrada e saída classificador por data.*/
io = async () => {
    sql = `SELECT DISTINCT date, (SELECT SUM(value) FROM moviment WHERE date=m.date AND type='input') AS input, (SELECT SUM(value) FROM moviment WHERE date=m.date AND type='output') AS output FROM moviment m;`;
    const result =await mysql.query(sql);
    return result;
}



/*GET   /cashbook/io/:year/:month  -> Retornar objeto contendo os valores totais de entrada e saída classificador por data. filtrados por ano e mes.*/
AnoMesFiltro = async (year, month) => {
    //sql = `SELECT (SELECT sum(value) FROM moviment WHERE type='input' AND YEAR(date)=${year} AND MONTH(date)=${month}) input, (SELECT sum(value) FROM moviment WHERE type='output' AND YEAR(date)=${year} AND MONTH(date)=${month}) output`;
    
    sql = `SELECT * FROM (SELECT * FROM moviment WHERE type='input' AND YEAR(date)=${year} AND MONTH(date)=${month}) AS input, (SELECT * FROM moviment WHERE type='output' AND YEAR(date)=${year} AND MONTH(date)=${month}) AS output`;
    const result = await mysql.query(sql);
    return result;
}
/*GET   /cashbook/io/:year/:month /:month -> Retornar objeto contendo os valores totais de entrada e saída classificador por data. filtrados por ano e mes inicial até mes final.*/
AnoMesIF = async ( year, month, finalyear, finalmonth) => {
    input = `SELECT * FROM moviment WHERE type='input' AND YEAR(date) BETWEEN ${year} AND ${finalyear} AND MONTH(date) BETWEEN ${month} AND ${finalmonth}`;
    output = `SELECT * FROM moviment WHERE type='output' AND YEAR(date) BETWEEN ${year} AND ${finalyear} AND MONTH(date) BETWEEN ${month} AND ${finalmonth}`;
    const resultinput = await mysql.query(input);
    const resultoutput = await mysql.query(output);
    if(resultinput && resultoutput){
        //resp = { data: year, month, finalyear, finalmonth, input: resultinput[0].input, output: resultoutput[0].output};
        resp={ input: resultinput, output: resultoutput}
    }
    return resp;
    //sql="SELECT (SELECT SUM(value) FROM moviment WHERE type = 'input' AND year(date) = "+year+" AND month(date) BETWEEN "+month1+" AND "+month2+") "+
    //"AS entrada, (SELECT SUM(value) FROM moviment WHERE type = 'output' AND year(date) = "+year+" AND month(date) BETWEEN "+month1+" AND "+month2+") "+
    //"AS saida, SUM(value) AS saldo FROM moviment WHERE year(date) = "+year+" AND month(date) BETWEEN "+month1+" AND "+month2+" LIMIT 1"
    //const result = await mysql.query(sql);
    //return {data: month1+"-"+year+" à "+month2+"-"+year,"entrada": result[0].entrada, "saida": result[0].saida, "saldo": result[0].saldo};
}
/*GET   /cashbook/:year/:month    -> Listar lançamentos do caixa de um ano e mes especifico;*/
AnoMes = async (year, month) => {
    sql = `SELECT * FROM moviment WHERE YEAR (date) = ${year} AND MONTH(date) = ${month}`;
    const result = await mysql.query(sql);
    if(result){
        return result;
    }
}
module.exports = {get,post, put, remove, cashbalance, io, AnoMesFiltro, AnoMesIF, AnoMes};