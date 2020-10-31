import 'dotenv/config';
import {
    FilesRouter
} from './routes';
import express, { json } from 'express';
import { connect } from 'mongoose';
const app = express();
const port = process.env.PORT || 3000;

app.use(json());
app.use('/files', FilesRouter);

app.listen(port, () => {
    console.log(`Listening to port ${port}`);

    connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, () => {
        console.log('Connected to the database.');
    });
});
