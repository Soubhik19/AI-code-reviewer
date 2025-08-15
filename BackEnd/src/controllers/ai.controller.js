const aiService = require('../Services/ai.services');

module.exports.getReview=async(req,res)=>{
const code = req.body.code;

if(!code) {
    return res.status(400).send('code is required');
}
const response = await aiService.generateContent(code);
res.send(response);

}