const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema =  new Schema({
    title:
    {type:String,
        required:true,
    },
    description:String,
image: {
  filename: {
    type: String,
    default: "listingimage"
  },
  url: {
    type: String,
    default: "https://images.stockcake.com/public/5/f/9/5f9c2b86-0649-41ea-b6ae-bb07385c78f5_large/sunset-over-ocean-stockcake.jpg",
    set: (v) => (!v || v.trim() === "")
      ? "https://images.stockcake.com/public/5/f/9/5f9c2b86-0649-41ea-b6ae-bb07385c78f5_large/sunset-over-ocean-stockcake.jpg"
      : v
  }
},
    price:Number,
    location:String,
    country:String,
});
const Listing = mongoose.model("listing", listingSchema);
module.exports= Listing;