
import { useEffect, useRef, useState } from 'react'
import './App.css';


function App() {
 const [message,setmessage]=useState<string[]>([]);
 const wsref=useRef<WebSocket>(null);
 const inputref=useRef<HTMLInputElement>(null);
  useEffect(()=>{
    const ws=new WebSocket("ws://localhost:8080");
    ws.onmessage=(event)=>{
      setmessage(m=>[...m,event.data]);
    }
   wsref.current=ws;// websocket ref 
    ws.onopen=()=>{
      ws.send(JSON.stringify(
        {
          type:"join",
          payload:{
            roomId:"red"
          }
        }
      ))
    }
    return ()=>{
      ws.close();
    }
  },[])


  return (
    <div className="h-screen w-screen bg-blue-100 flex justify-center items-center">
      
      <div className="bg-slate-200 h-[83%] w-[60%] shadow-md rounded-md p-4 flex flex-col justify-end overflow-y-auto">
        {message.map(message=><span className='inline-block max-w-[70%] h-10 text-black word-break bg-gray-100 rounded-md px-4 py-2.5 mb-2 leading-tight'>
          {message}
        </span>)}
       
        <div className="flex w-full h-10 gap-2 ">
          
          <input
            type="text"
            placeholder="enter the message"
            className="bg-white rounded-md h-full flex-1 px-4"
            ref={inputref}
          />

          <button
            className="bg-blue-500 w-24 h-full rounded-md cursor-pointer hover:bg-blue-400"
            onClick={()=>{
                const message=inputref.current?.value;// taking message from input box
                if(message)
                {
                  wsref.current?.send(JSON.stringify({
                    "type":"chat",
                    "payload":{
                      message:message
                    }
                  }
                ))
               if(inputref.current)
               {
                inputref.current.value=""
               }
                }
            }}
          >
            Send
          </button>

        </div>

      </div>

    </div>
  )
}

export default App