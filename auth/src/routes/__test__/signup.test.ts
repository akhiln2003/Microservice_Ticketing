import request from 'supertest';
import { app } from '../../app';


it("returns a 201 on a successfull signup" , async()=>{
    return request(app)
    .post('/api/users/signup')
    .send({
        email: "test@gmail.com",
        password: "guigj"
    })
    .expect(201);

});


it('return a 400 with an invalid email' , async()=>{
    return request(app)
    .post('/api/users/signup')
    .send({
        email:"testtest.com",
        password:"password"
    })
    .expect(400)
});

it('return a 400 with an invalid password' , async()=>{
    return request(app)
    .post('/api/users/signup')
    .send({
        email:"testtest.com",
        password:"p"
    })
    .expect(400)
});


it('return a 400 with missing email and password' , async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        eamil:"test@tes.com"
    })
    .expect(400)

    await request(app)
    .post('/api/users/signup')
    .send({
        password:"testdfd"
    })
    .expect(400)
})


it('disallow duplicate emails' , async ()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:"password"
    })
    .expect(201)

    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:"password"
    })
    .expect(400)
});

it('set a cookie after successful signup' , async ()=>{
    const response =  await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:"password"
    })
    .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined()
                          
})