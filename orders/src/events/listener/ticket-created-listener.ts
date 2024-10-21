import { Listener, Subjects, TicketCreatedEvent } from "@4ktickets/common";
import { Message } from "node-nats-streaming";
import { QueueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket-model";



export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = QueueGroupName;
    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { title, price , id } = data;
        const ticket = Ticket.build({
            id ,title, price
        });
        await ticket.save();

        msg.ack()
    }
}