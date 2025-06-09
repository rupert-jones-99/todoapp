import { Task, Todo } from "@/backend/db";
import { getRequest } from "@/backend/request";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

export default function Index() {
  const [state, setState] = useState<string>('');
  const db = useSQLiteContext();
  const [todos, setTodos] = useState<Task[]>([]);
  useEffect(()=>{
    async function setup() {
        const result = await db.getAllAsync<Todo>('SELECT * FROM todos');
        setTodos(result.map((value)=>new Task(value.id,value.name,value.state)));
    }
    setup();
  })
//   const [theme,setTheme]= useMMKVString('ui.color');
  
  const getState=(todoState:1|0)=>todoState===1?'Finished':'In progress';
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {todos.map((todo,index)=>(
        <View style={{opacity:0.9}} key={index}>
            <Text>{`[${getState(todo.state)}]${todo.name}`}</Text>
        </View>
      ))}
      <Text>{state}</Text>
      <Text>{}</Text>
      <Button
      title='Create'
      onPress={()=>getRequest().then((res)=>setState(res))}/>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
