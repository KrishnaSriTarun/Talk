const express = require('express');
const router = express.Router();
const upload = require('../cloudConfig');
const talkRouter=require('../controllers/talk');
const {isLoggedIn}=require('../middleware')

router.get('/', talkRouter.renderIndex);
router.get('/new',isLoggedIn,talkRouter.renderNew);
router.get('/search',isLoggedIn,talkRouter.renderSearch);
router.get('/user',isLoggedIn,talkRouter.renderUser);

router.post('/uploads', upload, talkRouter.postUpload);

module.exports = router;