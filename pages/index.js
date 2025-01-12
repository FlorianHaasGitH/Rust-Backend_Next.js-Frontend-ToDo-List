import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit, MdConfirmationNumber } from "react-icons/md";
import axios from "axios";
import { format } from "date-fns";

//IMPORT COMPONENT

const index = () => {
  const [editText, setEditText] = useState();
  const [todos, setTodos] = useState([]);
  const [todosCopy, setTodosCopy] = useState(todos);
  const [todoInput, setTodoInput] = useState("");
  const [editIdex, setEditIndex] = useState(-1);
  const [searchInput, setSearchInput] = useState("");

  //STATE MANAGMENT
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [searchItem, setSearchItem] = useState(search);

  return <div>index</div>;
};

const editTodo = (index) => {
  setTodoInput(todos[index].title);
  setEditIndex(index);
};

const fetchTodos = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/todos");
    setTodos(response.data);
    setTodosCopy(response.data);
  } catch (error) {
    console.log(error);
  }

  return <div>index</div>;
};

const addTodos = async () => {
  try {
    if(editIndex === -1)
    //ADD new todo
    const response = await axios.get("http://127.0.0.1:8000/todos", {
      title: todoInput,
      completed: false,
    });
    setTodos(response.data);
    setTodosCopy(response.data);
    setTodoInput("");
  } else {
    //UPDATE EXISTING TODO
    const todoToUpdate = {...todos[editIndex], title: todoInput};
    const response = await axios.put(
      `http://127.0.0.1:8000/todos${todoToUpdate.id}`,
      {
        todoToUpdate,
      }
    );
    console.log(response);
    const updatedTodos = [...todos];
    updatedTodos[editIndex] = response.data;
    setTodos(updatedTodos);
    setTodoInput("");
    setEditIndex(-1);
    setCount(count + 1);
  } catch (error) {
    console.log(error);
  }

const deleteTodo = async (id) => {
  try {
    const response = await axios.delete(
    `http://127.0.0.1:8000/todos${id}`);
    setTodos(todos.filter((todo) => todo.id !== id));
  } catch (error) {
    console.log(error)
  }
};

const toggleCompleted = async (index) => {
  try {
    const todoToUpdate = {
      ...todos[index],
      completed: !todos[index].completed
    }
    const response = await axios.delete(
    `http://127.0.0.1:8000/todos${todoToUpdate.id}`
    );
    const updatedTodos = [...todos];
    updatedTodos[index] = response.data;
    setTodos(updatedTodos);
    setCount(count + 1)
  } catch (error) {
    console.log(error)
  }
};

  return <div>index</div>;
}

export default index;

