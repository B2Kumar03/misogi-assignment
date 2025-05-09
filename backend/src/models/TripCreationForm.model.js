//create TripCreationForm model with "Trip_name, start_date,end_date,gruop_budget,praticipant(on the basis of vote),invited_user(on the basis of invite),Activites(on the basis of activities)"

import mongoose from "mongoose";
//create TripCreationForm model with "Trip_name, start_date,end_date,gruop_budget,praticipant(on the basis of vote),invited_user(on the basis of invite),Activites(on the basis of activities)

const tripCreationFormSchema = new mongoose.Schema({

    Trip_name: {
        type: String,
        required: true,
    },
    start_date: {
        type: String,
        required: true,
    },
    end_date: {
        type: String,
        required: true,
    },
    gruop_budget: {
        type: String,
    },
    praticipant: {
        type:[String],
        default: [],
        required: true,
    },
    invited_user: {
        type:[String],
        default: [],
    },
    Activites: {
        type: [{
           
        }],
        default: [],
    },
});

const TripCreationForm = mongoose.model("TripCreationForm", tripCreationFormSchema);

export default TripCreationForm;


