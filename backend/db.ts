import { SQLiteDatabase } from "expo-sqlite";

export async function migrateDbIfNeeded(db: SQLiteDatabase){
    const DATABASE_VERSION = 2;
    let { user_version: currentDbVersion } = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
    );
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE todos (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, state INTEGER NOT NULL, date INTEGER NOT NULL);
`);
    await db.runAsync('INSERT INTO todos (name, state, date) VALUES (?, ?)', 'wake up', 1, new Date().valueOf());
    await db.runAsync('INSERT INTO todos (name, state, date) VALUES (?, ?)', 'go to bed', 0, new Date().valueOf());
    currentDbVersion = 1;
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
export interface Todo {
    name:string;
    state:1|0;
    id:number;
}
export class Task {
    id:number;
    name:string;
    state:1|0;
    date: Date;
    static db: SQLiteDatabase;
    constructor(id:number,name?:string,state?:1|0,date?:Date){
        if(typeof name !== 'undefined' && name !==''){
            this.id    = id;
            this.name  = name;
            this.state = state===0?0:1;
            this.date = date as Date;
            return;
        }
        const data = Task.db.getFirstSync<Todo>(`SELECT * FROM todos WHERE id = ${id}`);
        if(data === null)throw new Error("Task not found");
        this.id    = data.id;
        this.name  = data.name;
        this.state = data.state;
        this.date = data.date;
    }
    public static async createTask(name:string) {
        const statement = await this.db.prepareAsync(
            `INSERT INTO todos (name,state) VALUES($name,$state,$date)`
        );
        let id = 0;
        try{
            let result = await statement.executeAsync({$value:name,$state:0,$date: new Date().valueOf()});
            id= result.lastInsertRowId;            
            console.log('name:'+name+'.');
        }catch(e:any){
            console.log(e.message);
            return 0;
        }
        finally{
            await statement.finalizeAsync();
            return id;
        }
        
    }
    async updateTaskName(id:number,name:string) {
        const statement = await Task.db.prepareAsync(
            `UPDATE todos SET name = ? WHERE id = ?`
        );
        try{
            let result = await statement.executeAsync([name,id]);
        }finally{
            await statement.finalizeAsync();
        }
    }
    async completeTask(id:number) {
        const statement = await Task.db.prepareAsync(
            `UPDATE todos SET state = ? WHERE id = ?`
        );
        try{
            let result = await statement.executeAsync([1,id]);
        
        }catch(e:any){
            console.log(e.message);
            return 0;
        }finally{
            await statement.finalizeAsync();
            return 1;
        }
    }
    async restartTask(id:number) {
        const statement = await Task.db.prepareAsync(
            `UPDATE todos SET state = ? WHERE id = ?`
        );
        try{
            let result = await statement.executeAsync([0,id]);
        }catch(e:any){
            console.log(e.message);
            return 0;
        }finally{
            await statement.finalizeAsync();
            return 1;
        }
    }
    async deleteTask(id:number) {
        const statement = await Task.db.prepareAsync(
            `DELETE FROM todos WHERE id = ?`
        );
        try{
            let result = await statement.executeAsync(id);
            console.log(result.changes);
        }catch(e:any){
            console.log(e.message);
            return 0;
        }finally{
            await statement.finalizeAsync();
            return 1;
        }
    }
}