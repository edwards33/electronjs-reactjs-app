import React, { Component } from "react";
import "../App.css";
import { Input, Button } from 'semantic-ui-react';
const { ipcRenderer } = window.require("electron");

class AddTodoWindow extends Component {
  state = {
    value: ""
  };

  onChange = e => {
    this.setState({ value: e.target.value });
  };

  onClick = () => {
    ipcRenderer.send("todo:add", { text: this.state.value });
  };

  render() {
    return (
      <div class="add-todo">
        <h1>Add Todo</h1>
        
        <Input
          autoFocus
          type="text"
          value={this.state.value}
          onChange={this.onChange}
          placeholder="Insert todo text"
        />
        <Button content='Add' onClick={this.onClick} />
      </div>
    );
  }
}

export default AddTodoWindow;
