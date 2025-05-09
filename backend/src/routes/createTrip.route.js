import Router from 'express';
import {createTrip,addActivities, getAllTrips, getSingleTrip, inviteUpdate, updateParticipant} from '../controllers/createTrip.controller.js';

const createTripRouter =Router()

createTripRouter.post("/create-trip",createTrip)
createTripRouter.post("/add-activities/:id",addActivities)
createTripRouter.get("/get-trip",getAllTrips)
createTripRouter.get('/get-single-trip/:id', getSingleTrip)

//update trip controller

createTripRouter.put('/update-trip',inviteUpdate )

createTripRouter.put('/update-participant',updateParticipant) 
  
export default createTripRouter;