import mongoose, { Schema, model, models } from "mongoose";

const ScanSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    barcode: { type: String, required: true, index: true },
    productName: { type: String },
    brand: { type: String },
    nutriscore: { type: String }, // product grade
    categories: [{type:String}],
    analysisResult: {
      status: {
        type: String,
        enum: ["safe", "unsafe", "unknown"],
        required: true,
      },
      reason: { type: String, required: true },
      score: { type: String },
      riskIngredients: [{ type: String }],
      nutritionFlags: [{ type: String }],
    },
  },
  { timestamps: true }
);

const Scan = models.Scan || model("Scan", ScanSchema);

export default Scan;
