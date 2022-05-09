import React, { useEffect, useState } from "react";

const Chat = ({ socket, table }) => {
    console.log('socket, table', socket, table)
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
            console.log('data', data);
            setfullChat((messages) => [...messages, data]);
        })
    }, [socket])

    return (
        <div>
            <div className="chatBox">{fullChat.map((mes) => {
                console.log('mes', mes)
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