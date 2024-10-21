import { Publisher , Subjects , TicketCreatedEvent } from "@4ktickets/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

