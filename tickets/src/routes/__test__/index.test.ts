import request from "supertest";
import { app } from "../../app";



it("can fetch bynch of tickets", async () => {
  await request(app).post("/api/tickets").set("Cookie", global.signin()).send({
    price: 12,
    title: "messi",
  });

  const response = await request(app).get("/api/tickets").send().expect(200);
 
  expect(response.body.length);
});