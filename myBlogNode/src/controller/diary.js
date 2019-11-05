const {exec} = require('../db/mysql');

const getDiary = ()=>{
    const sql = 'select * from diary';
    return exec(sql);
}

module.exports = {getDiary};