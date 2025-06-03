const mongoose = require("mongoose");

const ConditionSchema = new mongoose.Schema({
  field: { type: String, required: true },        // e.g., "spend", "visits", "lastActiveDays"
  comparator: { type: String, required: true },   // e.g., ">", "<", "==", ">=", "<="
  value: { type: mongoose.Schema.Types.Mixed, required: true },  // number or string
});

const RuleGroupSchema = new mongoose.Schema({
  operator: { type: String, enum: ["AND", "OR"], required: true },
  rules: [
    {
      // Either a Condition or a nested RuleGroup
      type: mongoose.Schema.Types.Mixed,
      required: true,
    }
  ],
});

const SegmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rules: {
    type: RuleGroupSchema,
    required: true,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  // optional
}, { timestamps: true });

module.exports = mongoose.model("Segment", SegmentSchema);
