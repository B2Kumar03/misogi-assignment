import mongoose  from "mongoose";
//create Activities model with "title, date, time, estimated_cost, optional_notes"

const activitiesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    estimated_cost: {
        type: String,
        required: true,
    },
    optional_notes: {
        type: String,
        required: true,
    },
    vote: {
        type: [String],
        default: [],
    },
});

const Activities = mongoose.model("Activities", activitiesSchema);

export default Activities;