import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';


console.clear();
const stan = nats.connect('ticketing', 'abc', {
    url: "http://localhost:4222"
});

stan.on('connect', async () => {
    console.log("Publisher connected to NATS");

    const publisher = new TicketCreatedPublisher(stan)
    try {
        await publisher.publish({
            id: '123',
            title: "conect",
            price: 908
        })
    } catch (err) {
        console.log(err);

    }


    // const data = JSON.stringify({
    //     id:'123',
    //     title:"conect",
    //     price:908
    // })

    // stan.publish('ticket:created' , data , ()=>{
    //     console.log("Event Published");

    // })  
})
