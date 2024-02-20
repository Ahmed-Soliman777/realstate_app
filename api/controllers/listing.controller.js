import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    // Create a model for the list
    const listing = await Listing.create(req.body);
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};