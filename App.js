import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

//Make connection with backend
const socket = io("http://localhost:5000");

function App() {
  const [userName, setUserName] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handelSubmit = (e) => {
    e.preventDefault();

    const obj = {
      userName: userName,
      message: message,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };

    //To Send Any data or tegger any event we use emit
    socket.emit("send-message", obj);
    setMessage("");
  };

  useEffect(() => {
    socket.on("recived-message", (msg) => {
      setMessages([...messages, msg]);
    });
  }, [socket, messages]);

  return (
    <div className="App">
      {!isConnected ? (
        <div>
          <input
            type="text"
            pleaceholder="Enter User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          ></input>
          <button
            type="submit"
            onClick={(e) => userName !== "" && setIsConnected(true)}
          >
            Connect
          </button>
        </div>
      ) : (
        <div>
          <div>
              {messages.map((msg, i) => (
                <div className="messageCard" key={i}>
                  <span>{msg.userName} </span>
                  <span>{msg.message} </span>
                  <span>
                    <small>{msg.time}</small>
                  </span>
                </div>
            ))}
          </div>
          <div>
            <form onSubmit={handelSubmit}>
              <input
                type="text"
                placeholder="Enet Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></input>
              <button type="submit"> Send </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
