require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/Listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const { wrap } = require("module");

const MONGOOSE_URL = process.env.ATLASDB_URL;
main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGOOSE_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req,res)=>{
    res.send("server is working")
});

//index route
app.get("/listings",wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

///new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});
///show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});    
}));

//create route 
// app.post("/listings", wrapAsync() async(req,res)=>{
//    // let {title , description , image , price , location , country} = req.body; INSTEAD OF WRITING THIS WE USE KEY VALUE
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// });

app.post("/listings", wrapAsync(async (req, res) => {
         if(!req.body.listing){
            throw new ExpressError(404,"send valid data for listing!!");
         }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    }));
//edit route
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
let {id} = req.params;
const listing = await Listing.findById(id);
res.render("listings/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id", wrapAsync(async(req,res)=>{
      if(!req.body.listing){
            throw new ExpressError(404,"send valid data for listing!!");
         }
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect(`/listings/${id}`);//aften edit it redirect to show page.
}));

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
 let {id} = req.params;
 let deletedListing = await Listing.findByIdAndDelete(id);
console.log(deletedListing);
res.redirect("/listings");
}));

// app.get("/testListing", wrapAsync() async (req,res)=>{
//     let samplelisting = new Listing({
//         title:"My New Villa",
//         description:"By Beach ",
//         price:1200,
//         location:"calangute Goa",
//         country:"India",
//     });
//     await samplelisting.save();
//     console.log("sample saved");
//     res.send("sample data");
// });
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//custom express error 
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;

    console.log(err); // helpful for debugging

    res.status(statusCode).send(message);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});