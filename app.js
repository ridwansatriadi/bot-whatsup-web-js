const { phoneNumberFormatter } = require('./formatnumber');
const qrcode = require('qrcode-terminal');
const express = require('express');
const { Client } = require('whatsapp-web.js');
const client = new Client();
const port = process.env.PORT || 8000;
const app = express();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

app.post('/send-otp', (req, res) => {
    const nomor = req.body.number;
    const pesan = req.body.pesan;
    client.sendMessage(nomor, pesan).then(response => {
        res.status(200).json({
            status: true,
            response: response
        });
    }).catch(err => {
        res.status(500).json({
            status: false,
            response: err
        });
    });
})


app.get('/send-multiple', (req, res) => {
    let nomorall = ["087865537114", "087763305916", "083114598634"];
    let b = 0;
    for (b; b < nomorall.length; b++) {
        const nomor = phoneNumberFormatter(nomorall[b]);
        client.sendMessage(nomor, "LotimDev").then(response => {
            console.log(response);
        }).catch(err => {
            res.status(500).json({
                status: false,
                response: err
            });
        });
    }
    if (b === nomorall.length) {
        res.status(200).json({
            status: true,
        });
    }
})

app.listen(port, function() {
    console.log('App running on *: ' + port);
});