const Post = require('../models/posts');
const User = require('../models/user');
module.exports.renderIndex = async (req, res) => {
      let datas = await Post.find({});
      res.render("main/index", { datas });
      // res.json(datas);
}
module.exports.renderNew = (req, res) => {
      res.render("main/new");
}
module.exports.renderSearch = (req, res) => {
      res.render("main/search");
}
module.exports.renderUser = (req, res) => {
      res.render("main/user");
}
module.exports.postUpload = async (req, res) => {
      const { description } = req.body;
      const { image, video } = req.media;
      const newData = new Post({ image, video, description, owner: req.user._id, });
      await newData.save();
      const user = await User.findById(req.user._id);
      user.posts.push(newData);
      await user.save();
      req.flash("success", "Successfully uploaded the post");
      res.redirect("/talk");
};
module.exports.searchUsers = async (req, res) => {
            const query = req.query.query;
            const users = await User.find({
                  $or: [
                        { username: { $regex: query, $options: "i" } },
                        { name: { $regex: query, $options: "i" } },
                  ]
            }).limit(10); 
            res.status(200).json(users);
}

