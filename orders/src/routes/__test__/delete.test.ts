import request from "supertest";
import { Ticket } from "../../models/ticket-model";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order-model";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it("mark an order as cancelled", async () => {
  // make req with to creat an order
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();
  const user = global.signin();
  // make req to create ord3re
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket._id })
    .expect(201);

    
  // req to cancel the order
  const { body: fetchOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits order cancelled event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();
  const user = global.signin();
  // make req to create ord3re
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket._id })
    .expect(201);
  // req to cancel the order
  const { body: fetchOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
}); 