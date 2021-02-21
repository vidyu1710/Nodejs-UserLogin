
let { registerUser, loginUser } = require('./app/api/v1/controller');
const express = require('express');
const app = express();
var router = express.Router();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', router);

router.post('/login' ,async (req,res) => {
    const response = await loginUser(req);
    res.status(response.statusCode).send(response.body);
	
});

router.post('/register' ,async (req,res) => {
    const response = await registerUser(req);
    res.status(response.statusCode).send(response.body);	
});

// router.get('/users/list' ,async (req,res) => {
//     // res.setHeader({'Content-type':'Application/JSON'});
//     // console.log("req body is",JSON.stringify(req));
//         const response = await insertUnits(req);
//         res.send(response);
	
// });

const SERVER = 
{
    port: 9000,
    api_version: 1
}


app.listen(SERVER.port, () => console.log(`Server started on port :` + SERVER.port));