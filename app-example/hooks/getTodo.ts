import { APIURL } from "@/constants/Urls";

export async function getTodo(){
    const connection = APIURL;
    const response = await fetch(connection,{
        method: "GET"
    });
    const json = await response.json();
    return JSON.stringify(json); 
}