import mongoose from "mongoose";
import request from 'supertest';
import { app } from "../../app";
import { Ticket } from "../../models/ticket-model";
import { Order, OrderStatus } from "../../models/order-model";
import { natsWrapper } from "../../nats-wrapper";


it("returns an error if the ticket does not exists", async () => {
  const ticketId = new mongoose.Types.ObjectId()._id;

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});


it("return an error if the ticket is alredy reserves", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();
  const order = Order.build({
    ticket,
    userId: 'dsfsetgtr',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});



it("reserve a ticket", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

});


it("emit an order created event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});