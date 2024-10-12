import mongoose from "mongoose";
import { Password } from "../services/password";

    // An interface that describes the propertices
    // that are required to create a new User 
interface UserAttrs {
    email: string;
    password: string
}

    // An interface that describes the propertices
    // that a User Model has 
interface UserModel extends mongoose.Model< USerDoc >{
    build( attrs : UserAttrs):USerDoc
}

    // An interface that describes the propertices
    // that a User Document has 
interface USerDoc extends mongoose.Document{
    email:string;
    password: string
}



const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },

} , {
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

userSchema.pre('save' , async function (done) {
    if( this.isModified('password')){
        const hashed = await Password.toHash(this.get('password')as string);
        this.set('password' , hashed )
    }
    done()
})

userSchema.statics.build = ( attrs : UserAttrs ) => new User(attrs)

const User = mongoose.model< USerDoc , UserModel >('User', userSchema);




export { User }