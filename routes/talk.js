const express = require('express');
const router = express.Router();
const upload = require('../cloudConfig');
const talkRouter=require('../controllers/talk');
const wrapAsync=require('../utils/wrapAsync');
const {isLoggedIn,ensureAuthenticated,validateMedia}=require('../middleware')

router.get('/', talkRouter.renderIndex);
router.get('/new',ensureAuthenticated,talkRouter.renderNew);
router.get('/search',ensureAuthenticated,talkRouter.renderSearch);
router.get('/user',isLoggedIn,talkRouter.renderUser);
router.post('/', upload,validateMedia, wrapAsync(talkRouter.postUpload));

module.exports = router;