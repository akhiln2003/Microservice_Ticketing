import { OrderCreatedEvent, Publisher, Subjects } from "@4ktickets/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    
}


