import { migrateDbIfNeeded } from "@/backend/db";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { createContext, Dispatch, Suspense } from "react";
import Fallback from "./fallback";


export type font_size=  number;
export type color_theme= 'native'|'dark'|'light';
export type AppContext = {
    font_size: font_size;
    color_theme: color_theme;
    setColor: Dispatch<React.SetStateAction<color_theme>>;
    setSize: Dispatch<React.SetStateAction<font_size>>;
}

const AppContextProvider= createContext<AppContext>(null);

export default function RootLayout() {
    //const [theme,setTheme]= useMMKVString('ui.color');
    //const [size,setSize] = useMMKVNumber('ui.font');
    //if(theme===undefined||theme.match('(native)|(dark)|(light)')?.length===0)setTheme('native');
    //if(size===undefined||size<1)setSize(14);
    return   (
    <Suspense fallback={<Fallback/>}>
    <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded} >
        <Stack> 
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
    </SQLiteProvider>
    </Suspense>
  )
}
