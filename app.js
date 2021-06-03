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
     res.render('index',{pageTitle:'Minimal Weather', degree:'',cityName:req.body.location,description:'',unit:'',time:'',image:'',imageSource:"",display:false,refreshed:'display:none'});
   
 })


 app.post('/',(req,res) => {
    let value, desc, icon, isDayTime,iconpack;
    console.log(req.body.location);
    const location = req.body.location
    fetch( `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=Ffx7XA6Jw14Zr7ykqaMGZznpAmhGo8pW%20&q=${location}`)
    .then(resp => {
    
        return resp.json();
    })
    .then(dataset => {
        const locationKey = dataset[0].Key;
      
        const city = dataset[0].LocalizedName;
       
          fetch(`http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=%20%09Ffx7XA6Jw14Zr7ykqaMGZznpAmhGo8pW%20`)
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
               num = result[0].WeatherIcon;
               isDayTime = result[0].IsDayTime;
              let imageSource;
              let image;
                
if(isDayTime){
  if((num == 1 || num ==2 || num==3 || num==4)) {
  image= "background-image:url('../assets/clear.jpg')"
  imageSource = "../assets/clear.png"
}
  else if((num == 6 || num == 7 || num == 8 || num == 5)){
  image= "background-image:url('../assets/rainy.jpg')"
  imageSource = "../assets/cloudy.png"
  }
  else if(num == 12 ||num == 13 ||num == 14 ||num == 15 ||num == 16 ||num == 17 ||num == 18 ){
  image= "background-image:url('../assets/rain.jpg')"
  imageSource = "../assets/rain.png"
  }
  else if(num == 11){   
  image= "background-image:url('../assets/fog.jpg')"
  imageSource = "../assets/fog.png"
  }
  else{  
  image= "background-image:url('../assets/snowDay.jpg')"
  imageSource = "../assets/snow.png"
  } 
}
if(!isDayTime){
  console.log("Entered second if")
 if (num == 33 || num ==34 || num==35) {
  image = "background-image:url('../assets/night.jpg')";
  imageSource = "../assets/clearnight.png"
} else if (num == 36 || num == 37 || num == 38 ) {
image = "background-image:url('../assets/cloudyNight.jpg')";
imageSource = "../assets/cloudynight.png"
} else if(num == 39 ||num == 40 ||num == 41 ||num == 42 ) {
image = "background-image:url('../assets/rain.jpg')";
imageSource = "../assets/thunderstorm.png"
}
else{
image = "background-image:url('../assets/snowNight.jpg')";
imageSource = "../assets/snow.png"
}
}

               res.render('index',{
                 pageTitle:'Minimal Weather', degree:value,cityName:req.body.location,description:desc,unit:`°C`,time:d.getHours()+":"+d.getMinutes(),image:image,imageSource:imageSource,display:true,refreshed:'display:block, text-align:center'
                });
            }).catch(err =>{
                console.log("There was some error in the second fetch:",err.message);
                res.render('error',{description:'There was some error in fetching details. Please check location or try again later.'});
              })
           
})
.catch(e =>{
    
    console.log("There was some error in first fetch",e.message);
    res.render('error',{description:'There was some error in fetching details. Please check location or try again later.'});
  })
 })



app.use(bodyParser.json());
app.set('view engine', 'ejs');






const port = process.env.PORT || 3000;
app.listen(port, ()=>{console.log("Listening on port " + port)});