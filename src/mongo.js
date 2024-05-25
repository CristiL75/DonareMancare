const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/monitoring_app")
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const AutentificareSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['beneficiar', 'donator'], 
    default: 'beneficiar' 
} 
});

const AutentificareCollection = mongoose.model("AutentificareCollection", AutentificareSchema);

const adreseSchema = new mongoose.Schema({
  address: String,
  latlng: {
    type: {
      lat: Number,
      lng: Number
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'AutentificareCollection' },
    required: true
  }
});

const AdreseCollection = mongoose.model("AdreseCollection", adreseSchema);

const foodSchema = new mongoose.Schema({
  food: String,
});



const FoodCollection = mongoose.model("Alimente", foodSchema);

const suggestionSchema = new mongoose.Schema({
  suggestion: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'], // Adaugă un enum pentru statusurile sugestiilor
    default: 'pending'
  }
});

const SuggestionsCollection = mongoose.model(
  "SuggestionsCollection",
  suggestionSchema
);

module.exports = {
  AutentificareCollection,
  AdreseCollection,
  FoodCollection,
  SuggestionsCollection,
}; 
