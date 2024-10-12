import express from 'express';
import 'express-async-errors'
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import { NotFountError, currentUser, errorHandler } from '@4ktickets/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouters } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';

const app = express();
app.set('trust proxy' , true);
app.use(json());
app.use(cookieSession({
  signed:false,
}));

app.use(currentUser);
app.use(showTicketRouters);
app.use(indexTicketRouter);
app.use(updateTicketRouter)
app.use(createTicketRouter); 


app.all('*' , async(req,res,next)=> {
     throw new NotFountError()
    })

app.use(errorHandler);


export { app }