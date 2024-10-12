import request from "supertest";
import { app } from "../../app";


it("as a route handiler listenign to /api/tickets for post request", async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).not.toEqual(404)
})


// it("can only be access if the user is signed in", async () => {
//      await request(app).post('/api/tickets').send({}).expect(401)
// });

it("return an error if an invalid title is provided", async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).not.toEqual(401)
});

// it("return a status other than 401 if the user is signed in     ", async () => {
//     request(app)
// })

// it("retrurn an error if an invaild price is provided", async () => {
//     request(app)
// })

// it("creates a ticket with vaild inputs", async () => {
//     request(app)
// })