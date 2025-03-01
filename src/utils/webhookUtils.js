// /src/utils/webhookUtils.js
const crypto = require('crypto');

const verifyWebhookSignature = (req, secret) => {
  const signature = req.headers['x-hub-signature'];
  const payload = JSON.stringify(req.body);

  // Create the HMAC digest
  const hmac = crypto.createHmac('sha1', secret);
  const digest = 'sha1=' + hmac.update(payload).digest('hex');

  return signature === digest;
};

module.exports = { verifyWebhookSignature };
