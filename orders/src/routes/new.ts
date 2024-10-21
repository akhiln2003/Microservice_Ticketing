import mongoose from 'mongoose';
import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import { BadRequestError, NotFountError, OrderStatus, requireAuth, validateRequest } from '@4ktickets/common';
import { Ticket } from '../models/ticket-model';
import { Order } from '../models/order-model';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
const EXPIRATION_WINDOW_SECOND = 15 * 60;

router.post('/api/orders', requireAuth,
    [body("ticketId").not().isEmpty().withMessage("Ticket id must be defined")]
    , validateRequest, async (req: Request, res: Response) => {
        const { ticketId } = req.body;

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) throw new NotFountError();


        const isReserved = await ticket.isReserved();
        if (isReserved) throw new BadRequestError('Ticket is alredy reserved');


        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECOND);

        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });

        await order.save()

        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiredAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price
            },
            version:order.version
            
        });

        res.status(201).send(order);
    });

export { router as newOrderRouter }