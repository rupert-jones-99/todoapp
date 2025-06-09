
export async function getRequest(){
    const request = await fetch('https://bored-api.appbrewery.com/random');
    const data = await request.json();
    return data.activity as string;
}
export function getRequestSync(){
    let data: string ='';
    getRequest().then(
        (res)=>data=(res) 
        
    );
    return data;
}
