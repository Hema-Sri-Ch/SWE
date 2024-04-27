import React from "react";
import MessageList from "../components/messageList";
import SendMessage from "../components/SendMessageI";
import SendMessageA from "../components/SendMessageA";

export default function Inbox(){
    
    const user_type = 0;

    if(user_type === 2) return(
        <div>
            <h1> Inbox </h1>
            <MessageList />
        </div>
    );

    else if(user_type === 1) return (
        <div>
            <h1> Inbox </h1>
            <MessageList />
            <SendMessage />
        </div>
    );

    else if(user_type === 0) return (
        <div>
            <h1> Inbox </h1>
            <MessageList />
            <SendMessageA />
        </div>
    );
}