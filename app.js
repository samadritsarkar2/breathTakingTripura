const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose");

// DB connection
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// mongoose.connect('mongodb://localhost:27017/app-tripura', {useNewUrlParser: true});
 mongoose.connect('mongodb+srv://sam:samadrit123@breathtakingtripura-a9ihc.mongodb.net/apptripura?retryWrites=true&w=majority', {useNewUrlParser: true});
 
// other connections 
app.use(bodyParser.urlencoded({ extended :true }) );
app.set("view engine", "ejs");

const itemSchema = new mongoose.Schema({
	name : String,
	description : String,
	url : String,
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

app.post("/new", (req,res)=>{
	var name = req.body.name;
	var desc = req.body.desc;
	var link = req.body.link;
	var user = req.body.user;
	newItem = { name : name , description : desc , url : link , user : user };
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

app.listen(3000, ()=>{
	
	console.log("Server Started ");
})