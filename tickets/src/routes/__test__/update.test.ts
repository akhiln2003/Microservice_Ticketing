import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";



it("return a 404 if not provided id does  not exist", async () => {
  const id = new mongoose.Types.ObjectId()._id;
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "sss",
      price: 20,
    })
    .expect(404);
});

it("return a 401 if not provided it not authenticated", async () => {
  const id = new mongoose.Types.ObjectId()._id;
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "sss",
      price: 20,
    })
    .expect(401);
});



it("return a 400 if the user provids an invalid title and price", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      price: 12,
      title: "messi",
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      price: 1,
      title: "",
    })
    .expect(400);
});

it("update the ticket", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      price: 12,
      title: "messi",
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      price: 10000,
      title: "messigoatsahal",
    })
    .expect(200);
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  expect(ticketResponse.body.title).toEqual("messigoatsahal");
  expect(ticketResponse.body.price).toEqual(10000);
});

it('it publish an event', async()=> {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      price: 12,
      title: "messi",
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      price: 10000,
      title: "messigoatsahal",
    })
    .expect(200);


});



it('rejects updates if the ticket is receved' , async()=>{
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      price: 12,
      title: "messi",
    });
    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({orderId : new mongoose.Types.ObjectId().toHexString()});
    await ticket!.save()
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      price: 10000,
      title: "messigoatsahal",
    })
    .expect(400);
})