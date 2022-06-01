import React, { useEffect, useState } from "react";

const Chat = ({ socket, table }) => {
    console.log('socket', socket);
    const [message, setMessage] = useState('');
    const [fullChat, setfullChat] = useState([]);

    const sendMessage = async () => {
        if (message !== '') {
            const socketMessage = {
                table: table,
                message: message,
                time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
            }
            await socket.emit('sendMessage', socketMessage)
        }
    }

    useEffect(() => {
        socket.on('getMessages', (data) => {
            setfullChat((messages) => [...messages, data]);
        })
    }, [socket])

    return (
        <div>
            <h3 className="chatHeader">Chat Box</h3>
            <div className="chatBox">{fullChat.map((mes) => {
                return (<div className="posts">
                    <p className="message">{mes.message}</p>
                    <p className="time">{mes.time}</p>
                </div>
                )
            })}</div>

            <div className="messageButtons">
                <input
                    onChange={(event) => setMessage(event.target.value)}
                ></input>
                <button
                    onClick={sendMessage}
                >Send Message</button>
            </div>

        </div>
    )
}

export default Chat;