const {saveFeedback} = require('../controller/feedback');
const {successModel,errorModel} = require('../model/model');

const feedback = (req,res)=>{
    const method = req.method;//POST或者Get

    //1.保存反馈意见
    if(method == "POST" && req.path=="/api/blog/uploadFeedback"){
        const {feedbackType,title,context} = req.body;
        const result = saveFeedback(feedbackType,title,context);
        return result.then((feedbackDat)=>{
            return new successModel(feedbackDat,"成功保存反馈意见");
        })
    }
}

module.exports = {feedback};