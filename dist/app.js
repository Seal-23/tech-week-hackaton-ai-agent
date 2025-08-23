"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.urlencoded({ extended: true }));
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
//# sourceMappingURL=app.js.map