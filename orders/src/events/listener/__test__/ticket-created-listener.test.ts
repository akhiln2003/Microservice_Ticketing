import { TicketCreatedEvent } from "@4ktickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose, { set } from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket-model";


const setup = async () => {

    const listner = new TicketCreatedListener(natsWrapper.client);
    const data: TicketCreatedEvent['data'] = {
        version: 0.,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    }
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { listner, data, msg }
}



it('creates ans saves  a ticket ', async () => {
    const { listner, data, msg } = await setup();

    await listner.onMessage( data , msg);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);

});