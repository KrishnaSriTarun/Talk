const Post=require('../models/data')
module.exports.renderIndex=async(req, res) => {
      let datas =await Post.find({});
      res.render("main/index",{datas});
}
module.exports.renderNew=(req, res) => {
      res.render("main/new");
}
module.exports.renderSearch=(req, res) => {
      res.render("main/search");
}
module.exports.renderUser= (req, res) => {
      res.render("main/user");
}
module.exports.postUpload=async (req, res) => {
      try {
            const { description } = req.body;
            const image = req.files.image ? req.files.image[0].path : null;
            const video = req.files.video ? req.files.video[0].path : null;
            if (!image && !video) {
                  return res.status(400).json({ error: 'Please upload either an image or a video.' });
            }
            const newData = new Post({ image, video, description });
            newData.owner = req.user._id;
            await newData.save();
            res.redirect('/talk');
      } catch (err) {
            console.error("Error:", err);
            res.status(500).json({ error: 'Something went wrong.' });
      }
}