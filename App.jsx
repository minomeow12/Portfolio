import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [tasks,setTasks] = useState([]); // store all tasks
  const [newTask, setNewTask] = useState('');  //for input box
  const [isLoaded, setIsLoaded] = useState(false); //track if initial load is complete
  const[editingIndex, setEditingIndex] = useState(null);
  const[editedText, setEditedText] = useState('');


    
// Load tasks once on first mount
useEffect(() => {
  try {
    const stored = localStorage.getItem('tasks'); // 1. Get tasks from localStorage (string)
    if (stored) {
      const parsed = JSON.parse(stored);  //2 convert string to array
      if (Array.isArray(parsed)) { //3. if valid array, set it to state
        setTasks(parsed);
      } else {
        console.warn("Parsed tasks is not an array:", parsed); //catch and log any errors
      }
    }
  } catch (e) {
    console.error("Failed to load tasks:", e);  //5. mark that inital load is done
  }
  setIsLoaded(true); //mark as loaded
}, []);

// Save tasks to localStorage only after initial load
useEffect(() => {
  if (isLoaded) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}, [tasks, isLoaded]);
 

  //add new task
  const addTask = () => {
    if (newTask.trim() === '') return; //do not add empty task
    const newTaskObj = { text: newTask, done: false}; //add new feature mark as done
    setTasks([...tasks, newTaskObj]);//add to list
    setNewTask(''); //clear input
  }

  //delete task by index
  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index); //keep everytask except the one at the index i delete
    setTasks(updated);
  }

  //toggleDone function
  const toggleDone = (index) => {
    const updated = tasks.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task
    );
  setTasks(updated);
  };

  //startEdititng function
  const startEditing = (index) => {
    setEditingIndex(index);
    setEditedText(tasks[index].text);
  };

  //saveEditedTask() function
  const saveEditedTask = () => {
    const updated = tasks.map((task,i) =>
      i === editingIndex ? { ...task, text: editedText } : task
  );
    setTasks(updated);
    setEditingIndex(null);
    setEditedText('');
  };


  //render UI
  return (
  
      <div className="container"> 
        <h1> My To-Do List</h1>
        {/*add input*/}
        <div className="input-row"> 
          <input
            type="text"
            value={newTask}
            placeholder="Enter a task..."
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTask();
            }}
            />
            {/*add button*/}
            <button onClick={addTask}>Add</button> 
        </div>
        {/*unordered List*/} {/* then add task list to loop thru every task in ur tasks array like "buy milk" with the index (position in the array) (used as the key for delete)*/}
        <ul>  
          {tasks.map((task, index) =>( 
            <li key={index}>
              <input 
                type="checkbox"
                checked={task.done}
                onChange={() => toggleDone(index)}
              />
              {editingIndex === index ? (
                <>
                  <input 
                    type="text"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEditedTask();
                    }}
                />
                 <button onClick={saveEditedTask}>💾 Save</button>
                </>
              ) : (
                <>
                  <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}> {task.text}
                  </span>
                  <button onClick={() => deleteTask(index)}>❌</button>
                  <button onClick={()=> startEditing(index)}>✏️</button>
                  </>
              )}
            </li>
          ))}
        </ul>
      </div>
      );
  }

export default App
