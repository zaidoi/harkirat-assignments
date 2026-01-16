const bodyParser = require("body-parser");
const express = require("express");
const app = express();
app.use(express.json());
app.use(bodyParser.json());
let todoList = [];
let todoId = 1;

app.get("/todos", (req, res) => {
  res.json({
    All: todoList,
  });
});

app.get("/todos/:id", (req, res) => {
  const todoId = req.params.id;
  const todoItem = todoList.filter((item) => item.id == todoId);
  if (todoItem.length == 0) {
    res.status(404).send("Not found");
  } else {
    res.json(todoItem);
  }
});

app.post("/todos", (req, res) => {
  const { title, completed, description } = req.body;
  createTodo(title, description, completed);
  res.json({
    title,
    completed,
    description,
  });
});

app.put("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, completed } = req.body;
  const todo = todoList.find((t) => t.id === id);
  if (!todo) {
    res.status(404).send("Not found");
  } else {
    todoList = todoList.map((item) => {
      if (item.id === id) {
        return {
          id:id,
          title: title,
          completed: completed,
        };
      }
      return item;
    });
    res.json({
        "msg":"Completed"
    })
  }
});

app.delete('/todos/:id',(req,res)=>{
    const id = Number(req.params.id);
    const todo = todoList.find(t => t.id == id)
    if(!todo) res.status(404).send('Not Found')
    todoList = todoList.filter((item) => item.id !== id )
    res.json({
        "msg":"Deleted"
    })
})

app.use((req,res) => {
    res.status(404).send('Route Not found')
})

function createTodo(id, t, d, c) {
  const todo = {
    id: todoId,
    title: t,
    description: d,
    completed: c,
  };
  todoList.push(todo);
  todoId++;
}

app.listen(3000);
