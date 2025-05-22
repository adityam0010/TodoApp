import { useState, useEffect,useRef  } from 'react';
import Navbar from './components/Navbar';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';
import React from "react";
import { useAuth } from "./AuthContext";
import { FcGoogle } from "react-icons/fc";



function App() {
  const isInitialMount = useRef(true);

  const { user, login, logout } = useAuth();

  const [todo, setTodo] = useState("");
  const [deadline, setDeadline] = useState(""); // NEW
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);

  useEffect(() => {
  let todoString = localStorage.getItem("todos");
  if (todoString) {
    let todos = JSON.parse(todoString);
    setTodos(todos);

    todos.forEach(task => {
      if (task.deadline) {
        const taskTime = new Date(task.deadline).getTime();
        const now = Date.now();
        const reminderTime = taskTime - 10 * 60 * 1000; // 10 minutes before
        const delay = reminderTime - now;

        if (delay > 0) {
          setTimeout(() => {
            showNotification(task.todo);
          }, delay);
        }
      }
    });
  }
}, []);


  useEffect(() => {
  if (isInitialMount.current) {
    isInitialMount.current = false;
  } else {
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}, [todos]);


  const showNotification = (taskText) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("⏰ Reminder!", {
        body: `Don’t forget to: ${taskText}`,
        icon: "/icon.png"
      });
    }
  };

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleEdit = (id) => {
    let t = todos.find(i => i.id === id);
    setTodo(t.todo);
    setDeadline(t.deadline || "");
    setTodos(todos.filter(item => item.id !== id));
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(item => item.id !== id));
  };

  const handleAdd = () => {
    if (todo.trim().length <= 3 || !deadline) return;

    const newTask = {
      id: uuidv4(),
      todo: todo.trim(),
      isCompleted: false,
      deadline: deadline
    };

    setTodos([...todos, newTask]);
    setTodo("");
    setDeadline("");

    const taskTime = new Date(deadline).getTime();
    const now = Date.now();
    const reminderTime = taskTime - 10 * 60 * 1000; // 10 minutes before
    const delay = reminderTime - now;

    if (delay > 0) {
      setTimeout(() => {
        showNotification(newTask.todo);
      }, delay);
    }
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(newTodos);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-violet-100 gap-3">
        <FcGoogle size={60} />
        <button
          onClick={login}
          className="bg-violet-800 hover:bg-violet-950 text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300"
        >
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 dark:bg-gray-800 text-black dark:text-white min-h-[80vh] md:w-[35%]">
        <div className="text-center mb-4 text-lg font-bold text-gray-700 dark:text-white">
          Welcome, <span className="font-bold text-black dark:text-white">{user.displayName}</span>
        </div>

        <h1 className='font-bold text-center text-3xl'>MyTask - Your todos at one place</h1>

        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className='text-2xl font-bold'>Add a Todo</h2>
          <div className="flex flex-col gap-3">
            <input
              onChange={handleChange}
              value={todo}
              type="text"
              placeholder="Enter task"
              className="w-full rounded-full px-5 py-2 bg-white text-black dark:bg-gray-700 dark:text-white"
            />
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-full px-5 py-2 bg-white text-black dark:bg-gray-700 dark:text-white"

            />
            <button
              onClick={handleAdd}
              disabled={todo.length <= 3 || !deadline}
              className='bg-violet-800 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white'
            >
              Save
            </button>
          </div>
        </div>

        <input className='my-4' id='show' onChange={toggleFinished} type="checkbox" checked={showFinished} />
        <label className='mx-2' htmlFor="show">Show Finished</label>

        <div className='h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2'></div>
        <h2 className='text-2xl font-bold'>My Todos</h2>

        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No Todos to display</div>}
          {todos.map(item =>
            (showFinished || !item.isCompleted) && (
              <div key={item.id} className="todo flex my-3 justify-between">
                <div className='flex flex-col gap-1 w-full'>
                  <div className='flex items-center gap-3'>
                    <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} />
                    <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
                  </div>
                  {item.deadline && (
                    <div className="text-xs text-gray-600 dark:text-gray-300 pl-6">
                      ⏰ {new Date(item.deadline).toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="buttons flex h-full">
                  <button onClick={() => handleEdit(item.id)} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><FaEdit /></button>
                  <button onClick={() => handleDelete(item.id)} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><AiFillDelete /></button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default App;
