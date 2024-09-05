import mongoose,{Document,Schema} from "mongoose";

interface IUser extends Document{
    email:string;
    password:string;
    sessionToken?:string;
}

const UserSchema:Schema =new Schema({
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    sessionToken:{
        type:String,
        default:null,
    }
});

export default mongoose.model<IUser>('User',UserSchema);