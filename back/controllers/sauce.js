const Sauce = require("../models/sauce");
const fs = require("fs");
const user = require("../models/user");
const sauce = require("../models/sauce");

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.createSauce = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  req.body.sauce = JSON.parse(req.body.sauce);

  const sauce = new Sauce({
    userId: req.auth.userId,
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    mainPepper: req.body.sauce.mainPepper,
    imageUrl: url + "/images/" + req.file.filename,
    heat: req.body.sauce.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  console.log(sauce);
  sauce.save().then(
    () => {
      res.status(201).json({
        message: "A new sauce saved successfully!"
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params.id });
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
      _id: req.params.id,
      userId: req.body.sauce.userId,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      imageUrl: url + "/images/" + req.file.filename,
      heat: req.body.sauce.heat,
      likes: req.body.sauce.likes,
      dislikes: req.body.sauce.dislikes,
      usersLiked: req.body.sauce.usersLiked,
      usersDisliked: req.body.sauce.usersDisliked
    };
  } else {
    sauce = {
      _id: req.params.id,
      userId: req.body.userId,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      heat: req.body.heat,
      likes: req.body.likes,
      dislikes: req.body.dislikes,
      usersLiked: req.body.usersLiked,
      usersDisliked: req.body.usersDisliked
    };
  }
  console.log(sauce);
  Sauce.updateOne({ _id: req.params.id }, sauce).then(
    () => {
      res.status(201).json({
        message: "Sauce updated successfully!"
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then(
    (sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink("images/" + filename, () => {
        Sauce.deleteOne({ _id: req.params.id }).then(
          () => {
            res.status(200).json({
              message: "Sauce deleted successfully!"
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      });
    }
  );
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then(
    (sauce) => {

      // if users like the sauce
      if (req.body.like === 1) {
        if (!sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId)) {
          sauce.usersLiked.push(req.body.userId);
          sauce.likes += 1;
        } else if (!sauce.usersLiked.includes(req.body.userId) && sauce.usersDisliked.includes(req.body.userId)) {
          sauce.usersDisliked.forEach((user, index) => {
            if (user === req.body.userId) {
              sauce.usersDisliked.splice(index, 1);
            }
          });
          sauce.dislikes -= 1;

          sauce.usersLiked.push(req.body.userId);
          sauce.likes += 1;
        }

      // if users dislike the sauce
      } else if (req.body.like === -1) {
        if (!sauce.usersDisliked.includes(req.body.userId) && !sauce.usersLiked.includes(req.body.userId)) {
          sauce.usersDisliked.push(req.body.userId);
          sauce.dislikes += 1;
        } else if (!sauce.usersDisliked.includes(req.body.userId) && sauce.usersLiked.includes(req.body.userId)) {
          sauce.usersLiked.forEach((user, index) => {
            if (user === req.body.userId) {
              sauce.usersLiked.splice(index, 1);
            }
          });
          sauce.likes -= 1;

          sauce.usersDisliked.push(req.body.userId);
          sauce.dislikes += 1;
        }
        
      // if users don't like nor dislike the sauce
      } else {
        if (sauce.usersLiked.includes(req.body.userId)) {
          sauce.usersLiked.forEach((user, index) => {
            if (user === req.body.userId) {
              sauce.usersLiked.splice(index, 1);
            }
          });
          sauce.likes -= 1;
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          sauce.usersDisliked.forEach((user, index) => {
            if (user === req.body.userId) {
              sauce.usersDisliked.splice(index, 1);
            }
          });
          sauce.dislikes -= 1;
        }
      }
      console.log(sauce);
      Sauce.updateOne({ _id: req.params.id }, sauce).then(
        () => {
          res.status(200).json({
            message: "Updated your like!"
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
    }
  );
};