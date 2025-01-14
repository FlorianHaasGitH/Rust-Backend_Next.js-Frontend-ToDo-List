import React, { useState, useEffect } from "react";
import axios from "axios";

const Index = () => {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    try {
      if (editIndex === -1) {
        // Add new todo
        const response = await axios.post("http://127.0.0.1:8000/todos", {
          title: todoInput,
          completed: false,
        });
        setTodos(response.data);
      } else {
        // Update existing todo
        const todoToUpdate = todos[editIndex];
        const response = await axios.put(
          `http://127.0.0.1:8000/todos/${todoToUpdate.ui}`,
          {
            title: todoInput,
          }
        );
        setTodos(response.data);
        setEditIndex(-1);
      }
      setTodoInput("");
    } catch (error) {
      console.error("Error adding/updating todo:", error);
    }
  };

  const deleteTodo = async (ui) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/todos/${ui}`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleCompleted = async (index) => {
    try {
      const todoToUpdate = todos[index];
      const response = await axios.put(
        `http://127.0.0.1:8000/todos/${todoToUpdate.ui}`,
        {
          completed: !todoToUpdate.completed,
        }
      );
      setTodos(response.data);
    } catch (error) {
      console.error("Error toggling completed:", error);
    }
  };

  const searchTodo = () => {
    const results = todos.filter((todo) =>
      todo.title.toLowerCase().includes(searchInput.toLowerCase())
    );
    setTodos(results);
  };

  return (
    <div>
      <h1>Todo App</h1>
      <input
        type="text"
        value={todoInput}
        onChange={(e) => setTodoInput(e.target.value)}
      />
      <button onClick={addTodo}>{editIndex === -1 ? "Add" : "Update"}</button>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search todos..."
      />
      <button onClick={searchTodo}>Search</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={todo.ui}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => setEditIndex(index)}>Edit</button>
            <button onClick={() => deleteTodo(todo.ui)}>Delete</button>
            <button onClick={() => toggleCompleted(index)}>
              {todo.completed ? "Unmark" : "Complete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
