
import mongoose from 'mongoose'

const marketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  // Adding coordinates for map features later
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  }
}, {
  timestamps: true,
});

const Market = mongoose.model('Market', marketSchema);
export default Market;
