import { NotAuthorizedError, NotFountError, requireAuth } from '@4ktickets/common';
import  express , {  Response, Request }  from 'express';
import { Order } from '../models/order-model';

const router = express.Router();


router.get('/api/orders/:orderId' , requireAuth , async( req: Request , res:Response) =>{


    const order = await Order.findById(req.params.orderId).populate('ticket');

    if( !order ) throw new NotFountError();
    
    if( order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    res.send({order});
});

export { router as showOrderRouter }