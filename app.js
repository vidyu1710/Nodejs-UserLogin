
let { registerUser, loginUser, getUserList } = require('./app/api/v1/controller');
const express = require('express');
const app = express();
var router = express.Router();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', router);

router.get('/abc' ,async (req,res) => {
    res.status(200).send({"message":"hello"});
	
});

router.post('login' ,async (req,res) => {
    const response = await loginUser(req);
    res.status(response.statusCode).send(response.body);
	
});

router.post('register' ,async (req,res) => {
    const response = await registerUser(req);
    res.status(response.statusCode).send(response.body);	
});

router.post('users/list' ,async (req,res) => {
    const response = await getUserList(req);
    res.status(response.statusCode).send(response.body);	
});

const SERVER = 
{
    port: 5000,
    api_version: 1
}


app.listen(process.env.PORT || 5000)
