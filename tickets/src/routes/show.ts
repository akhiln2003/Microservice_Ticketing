import express , { Response , Request} from 'express';
import { Ticket } from '../models/ticket';
import { NotFountError } from '@4ktickets/common';


const router = express.Router();



router.get('/api/tickets/:id' , async(req:Request,res:Response)=>{
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        console.log("this is insde if condiction "  , ticket);
        
        throw new NotFountError();
    }
    res.send(ticket)
});
    
    
    
export { router as showTicketRouters };
