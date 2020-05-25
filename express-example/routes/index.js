var express = require('express');
var router = express.Router();

const getSplitKey = (req) => {
  if (process.env.SPLIT_API_KEY === "localhost") {
    const keyFromCookie =
          req &&
          req.cookies &&
          req.cookies.splitTreatment;

    // fallback to 'localhost' if no cookie exists
    return keyFromCookie || 'localhost';
  }
  
  // otherwise perform existing logic to get the key
  return 'key';
};

/* GET home page. */
router.get('/', async function(req, res, next) {
  const feature = 'my_feature';
  const keyForRequest = getSplitKey(req);
  const treatment = await req.splitClient.getTreatment(keyForRequest, 'my_feature');

  res.render('index', { feature, treatment });
});

module.exports = router;
