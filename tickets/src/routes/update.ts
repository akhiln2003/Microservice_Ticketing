import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { NotAuthorizedError, NotFountError, validateRequest } from "@4ktickets/common";


const router = express.Router();

router.put('/api/tickets/:id', [
    body('title')
    .not()
    .isEmpty()
    .withMessage("Title is required"),
    body('price')
    .isFloat({gt:0})
    .withMessage("Price must be provided and must be greater than 0")
] , validateRequest , async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw new NotFountError()
    }
    if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }
    const { title , price } = req.body;

    ticket.set({
        title,
        price
    })
    await ticket.save();
    res.send(ticket)
});

export { router as updateTicketRouter };