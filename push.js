var webPush = require('web-push');
const vapidKeys = {
    "publicKey": "BFyXVhzGFnbr8kzNGc5IQQti-kfcSpbHRi6pFg42SYeTh9xCI1fLHkxyVbAR9Sk_qUTHLrFdN1sNu6mLtWQfqJE",
    "privateKey": "2UuzYxYqwxTQbdsJmvCA3nm3nGbokaNzkjbRW_5k_io"
};


webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/fS0x8Qn-VnY:APA91bFU6ozoIRmXLRBl20-z7X9gdZEExVCvD8xSzV3ij2663p99t992uWYDQOkhZV8CiRlj1zADbc48dmk-qCnpMRp2QUGaqgsU0CA7Vh9zj-eM3hDV4rhrimE1FlwSGH3QazGY8uuX",
    "keys": {
        "p256dh": "BJwZVRSg39RnFOURY5nYadnS0UhCeBVdo25BS975iOtfGfs8nACHaDg/0T6J0JVQ4tuvPYZhKb20CPdoWmql4hs=",
        "auth": " KjF+xIjO1uRNlnqkDsvGfQ=="
    }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
var options = {
    gcmAPIKey: '763249034688',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);