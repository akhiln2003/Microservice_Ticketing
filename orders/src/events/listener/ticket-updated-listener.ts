import { Listener, Subjects, TicketCreatedEvent, TicketUpdatedEvent } from "@4ktickets/common";
import { Message } from "node-nats-streaming";
import { QueueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket-model";



export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = QueueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findByEvent(data)
        if (!ticket) throw new Error("Ticket not fount");

        const { title, price } = data;
        ticket.set({ title, price });
        await ticket.save();

        msg.ack()
    }
}