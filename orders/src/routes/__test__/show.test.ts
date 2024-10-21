import request from "supertest";
import { Ticket } from "../../models/ticket-model";
import { app } from "../../app";
import mongoose from "mongoose";

it("fetches the order", async () => {
  // creaet a titcket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),  
    title: "concert",
    price: 20,
  });

  await ticket.save();

  const user = global.signin();

  // make a req to build an order with ricket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket._id })
    .expect(201);

    
  // req to fetch that order
  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);
    
  expect(fetchOrder.order.id).toEqual(order.id);
});

it("retuen err if one user try to fetch other user order", async () => {
  // creaet a titcket
const ticket = Ticket.build({
  id: new mongoose.Types.ObjectId().toHexString(),
  title: "concert",
  price: 20,
});

await ticket.save();
const user = global.signin();
// make req to to creaet order with anonther user
const { body: order } = await request(app)
  .post("/api/orders")
  .set("Cookie", user)
  .send({ ticketId: ticket._id })
  .expect(201);

await request(app)
  .get(`/api/orders/${order.id}`)
  .set("Cookie", global.signin())
  .send()
  .expect(401);
});