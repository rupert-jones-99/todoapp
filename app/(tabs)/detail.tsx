import { View } from "react-native";

interface DetailProps{
    state: boolean;
    created: Date; 
    name: string;
}
export default function Detail(props: DetailProps){
    props= props??{
        state:false,
        created: new Date(),
        name: "Clean the room!"
    }
    return(<View>
        
    </View>)
}