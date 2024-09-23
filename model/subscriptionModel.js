const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    Status: {
        type:String,
        enum:["inActive","active"]
    },
    plans: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "plan",
        },
      ],
    Trackuser: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true }
);
const subscriptionModel = mongoose.model("subcription", subscriptionSchema);
module.exports = subscriptionModel;
