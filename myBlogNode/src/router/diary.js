const {successModel,errorModel} = require('../model/model');
const {getDiary} = require('../controller/diary')

const diary = (req,res)=>{
    const method = req.method;//POST或者Get
    //1.获取日记
    if(method == "GET" && req.path=="/api/blog/getDiary"){
        const result = getDiary();
        return result.then((diaryData)=>{
            return new successModel(diaryData);
        })
    }
}

module.exports = {diary};