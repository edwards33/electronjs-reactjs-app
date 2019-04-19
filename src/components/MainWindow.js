import React, { Component } from "react";
import { Grid, Container, Card, Button } from 'semantic-ui-react';
const { ipcRenderer } = window.require("electron");

class MainWindow extends Component {
  state = {
    todos: []
  };

  deleteTodo = id => e => {
    ipcRenderer.send("todo:delete", { id });
  };

  componentDidMount() {
    ipcRenderer.send("todo:list");

    ipcRenderer.on("todo:list", (event, data) => {
      this.setState({ todos: data });
    });
  }

  renderTodos = () => {
    return this.state.todos.map(todo =>
        <Card> 
            <Card.Content key={todo.id}>
                <Card.Description>{todo.text}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className='ui two buttons'>
                  <Button basic color='red' onClick={this.deleteTodo(todo.id)}>
                    Delete
                  </Button>
                </div>
            </Card.Content>
        </Card>
    );
  };

  render() {
    return (
      <Grid>
          <Grid.Row columns={3}>
            <Grid.Column></Grid.Column>
            <Grid.Column>
              <Container textAlign='center'><h1>Todos</h1></Container> 
            </Grid.Column>
            <Grid.Column></Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={1}>
            </Grid.Column>
            <Grid.Column width={14}>
              <Card.Group>
                {this.renderTodos()}
              </Card.Group>
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
          </Grid.Row>
      </Grid>
    );
  }
}

export default MainWindow;
