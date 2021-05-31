const express = require('express');
const app = express();
const  bodyParser = require('body-parser');
const fetch = require('node-fetch');
let d = new Date();
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: false
 }));

 app.use('/assets',express.static('assets'));

 app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

 app.get('/',(req,res) => {
     res.render('index',{pageTitle:'Minimal Weather', degree:'',cityName:req.body.location,description:'',unit:'C',time:'',icon:''});

 })


 app.post('/',(req,res) => {
    let value, desc, icon, isDayTime,iconpack;
    console.log(req.body.location);
    const location = req.body.location
    fetch(`https://dataservice.accuweather.com/locations/v1/cities/search?apikey=6SqOA8mHYb8i7SyZ5pMtRHLyxvjUo8nw%20&q=${location}`)
    .then(resp => {
    
        return resp.json();
    })
    .then(dataset => {
        const locationKey = dataset[0].Key;
      
        const city = dataset[0].LocalizedName;
       
          fetch(`http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=6SqOA8mHYb8i7SyZ5pMtRHLyxvjUo8nw`)
            .then(data => {
              return data.json();
            })
            .then(result => {
              console.log(result);
              console.log(result[0].Temperature.Metric.Value);
              console.log(result[0].WeatherText);
              console.log(result[0].WeatherIcon);
              console.log(result[0].IsDayTime)
              // console.log(result[0].LocalObservationDateTime);
               value = Math.round(result[0].Temperature.Metric.Value);
               desc = result[0].WeatherText;
               iconpack = result[0].WeatherIcon;
               isDayTime = result[0].IsDayTime;
        
                function dayTime(){
                    return isDayTime;
                }


               res.render('index',{pageTitle:'Minimal Weather', degree:value,cityName:req.body.location,description:desc,unit:'C',time:d.getHours()+":"+d.getMinutes(),icon:icon});
            }).catch(err =>{
                console.log("There was some error in the second fetch:",err.message);
              })
           
})
.catch(e =>{
    
    console.log("There was some error in first fetch",e.message);
  })
 })



app.use(bodyParser.json());
app.set('view engine', 'ejs');






const port = process.env.PORT || 3000;
app.listen(port, ()=>{console.log("Listening on port " + port)});