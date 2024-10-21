import express from 'express';
import 'express-async-errors'
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import { NotFountError, currentUser, errorHandler } from '@4ktickets/common';
import { deleteOrderRouter } from './routes/delete';
import { newOrderRouter } from './routes/new';
import { indexOrderRouter } from './routes';
import { showOrderRouter } from './routes/show';

const app = express();
app.set('trust proxy' , true);
app.use(json());
app.use(cookieSession({
  signed:false,
}));

app.use(currentUser);
app.use(deleteOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter)
app.use(indexOrderRouter); 


app.all('*' , async(req,res,next)=> {
     throw new NotFountError()
    })

app.use(errorHandler);


export { app }