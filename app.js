const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  fileUpload = require("express-fileupload"),
	  cloudinary = require("cloudinary") ;

const port = process.env.PORT || 3000;
// DB connection
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// mongoose.connect('mongodb://localhost:27017/app-tripura', {useNewUrlParser: true});
mongoose.connect('#mongoDBurl(removed)', {useNewUrlParser: true});

// Cloudinary config 

cloudinary.config({
  cloud_name: 'samadritsarkar',
  api_key: '989154123181162',
  api_secret: 'f0rJ311-OCNRHHh4DDjHofxT6WI'
});
 
// other connections 
app.use(bodyParser.urlencoded({ extended :true }) );
app.set("view engine", "ejs");
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

const itemSchema = new mongoose.Schema({
	name : String,
	description : String,
	image_url : String,
	image_id :String,
	user : String
})

const Item = mongoose.model("Item", itemSchema);

app.get("/", (req,res)=>{
	Item.find({}, (err, allLocations)=>{
		if(err){
			console.log("EHHH....error occured !!");
			console.log(err);
		}
		else{
				res.render("index", {items : allLocations} );
		}
	})

	
})

app.get("/new", (req,res)=>{
	res.render("new")
})

app.post("/new", async (req,res)=>{
	var name = req.body.name;
	var desc = req.body.desc;
	var image = req.files.image;
	var user = req.body.user;
	
	var image_data = await cloudinary.uploader.upload(image.tempFilePath, (err, result)=>{
		if(err)
			{
		console.log("Error : ", err);
			}
		// console.log(result);
		// console.log("Result : ", result  );
	})
	// console.log(image_data.secure_url , image_data.public_id);
	var image_url = image_data.secure_url;
	var image_id = image_data.public_id; 
	newItem = { name : name , description : desc , image_url : image_url ,image_id : image_id, user : user };
	Item.create(newItem, (err, newAddedItem)=>{
		if(err){
			console.log("EHHH....error occured !!");
			console.log(err);
		}
		else{
				console.log("New location was added to db.");
				res.redirect("/");
		}
	})
})

app.listen(port, ()=>{
	
	console.log("Server Started ");
})
