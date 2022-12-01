const movimentoModel = require('../models/movimentModel');

exports.post = async(data,idUser)=>{
    return await movimentoModel.post(data, idUser);
}
exports.get = async(query)=>{
    return await movimentoModel.get(query);   
}

exports.put = async(req,res)=>{
    return await movimentoModel.put(data, idUser);
}
exports.delete = async(id)=>{
    return await movimentoModel.delete(id,idUser);
}

//////////////////////////////////////

exports.cashbalance = async () => {
    return await movimentoModel.cashbalance();
}

exports.io = async () => {
    return await movimentoModel.io();
}
exports.AnoMesFiltro=async(year, month)=>{
    return await movimentoModel.AnoMesFiltro(year, month);
};
exports.AnoMesIF = async (finalyear, finalmonth, year, month) => {
    return await movimentoModel.AnoMesIF(finalyear, finalmonth, year, month);
}
exports.AnoMes = async (year, month) => {
    return await movimentoModel.AnoMes(year, month);
}