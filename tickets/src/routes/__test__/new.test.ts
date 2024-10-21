import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";




it("has a route handler listneing to /api/tickets for post request ", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});


it("can be only access if user signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("return an a status othere than 401 if user is signed in ", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({});

  expect(response.status).not.toEqual(401);
});


it("createe ticket with valid parameters", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      price: 12,
      title: "messi",
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(12);
});

it("publishes as an event", async () => {
  const title = "mesi";
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      price: 12,
      title: title,
    })
    .expect(201);
});