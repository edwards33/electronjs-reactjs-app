const uuid = require("uuid");
const fs = require("fs");
const loki = require('lokijs');

class DataStore {
  constructor () {
    this.db = new loki(require('path').resolve(__dirname, './db_loki.json'));

    fs.readFile("db_loki.json", (err, jsonTodos) => {
      if (!err) {
        const oldLoki = JSON.parse(jsonTodos);
        if('filename' in oldLoki) {
          this.db.loadJSON(jsonTodos);
        }
        this.todosFromDb = this.db.getCollection('todos');
        if (this.todosFromDb === null) {
          this.todosFromDb = this.db.addCollection('todos');
        }
    
        this.todos = this.todosFromDb.find({});
      }
    });
  }

  trace (message) {
    if (typeof console !== 'undefined' && console.log) {
      console.log(message);
    }
  }

  saveTodos () {
    this.db.save();
    this.todos = this.todosFromDb.find({});
  }

  getTodos () {
    this.todos = this.get('todos') || []

    return this
  }

  addTodo (data) {
    const todo = {
        id: uuid(),
        text: data.text
    };

    this.todosFromDb.insert(todo);
  
    this.saveTodos();

    return this.todos;
  }

  deleteTodo (data) {
    var todoToEdit = this.todosFromDb.find( {'id': data.id} );

    this.todosFromDb.remove(todoToEdit);

    this.saveTodos();

    return this.todos;
  }
}

module.exports = DataStore
