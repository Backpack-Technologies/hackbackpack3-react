import React, { Component } from 'react';
import io from 'socket.io-client';

class App extends Component {
  socket = {};
  constructor() {
    super();
    this.socket = io('192.168.0.108:4008').connect();
    this.state = { messages: [], chatInput: '' };
    this.socket.on('server:message', message => {
      this.addMessages(message);
    });
  }

  onChangeHandler = event => {
    this.setState({ chatInput: event.target.value });
  };

  onSubmitHandler = event => {
    event.preventDefault();

    const messageObject = {
      content: this.state.chatInput
    };

    this.socket.emit('client:message', messageObject);
    this.setState({ chatInput: '' });
    messageObject.fromMe = true;

    this.addMessages(messageObject);
  };

  addMessages = message => {
    // const messages = this.state.messages;
    // messages.push(message);
    this.setState({ messages: [message, ...this.state.messages] });
  };

  render() {
    const messages = this.state.messages.map((message, id) => {
      const fromMe = message.fromMe ? 'from-me' : '';
      return (
        <div className={`message ${fromMe}`} id="messageList">
          <div className="message-body">{message.content}</div>
        </div>
      );
    });
    return (
      <div className="container">
        <h3>Hacker's Chatroom</h3>
        <form className="chat-input" onSubmit={this.onSubmitHandler}>
          <input
            type="text"
            value={this.state.chatInput}
            onChange={this.onChangeHandler}
            placeholder="Write something"
            required
          />
        </form>
        {messages}
      </div>
    );
  }
}

export default App;
