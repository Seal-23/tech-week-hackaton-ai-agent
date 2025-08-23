import express from 'express';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.post('/message-recived', (req, res) => {
    console.log('=== Body recibido ===');
    console.log(req.body); 

    console.log('=== Params ===');
    console.log(JSON.stringify(req.params));

    res.send('OK');
});

app.get('/', (_, res) => res.send('OK'));


app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});