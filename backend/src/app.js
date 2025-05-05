import express from 'express';
import cors from 'cors';


const app = express();
app.use(express.json({ limit: '50mb' }));  // Adjust the limit as needed
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use(cors({
  origin: '*', // Allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));


export default app;