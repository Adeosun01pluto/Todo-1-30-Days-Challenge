import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState("")
  const [taskList, setTaskList] = useState([])
  const [showModal, setShowModal] = useState(false);
// #3d1053
// #df6688
  const editTask = (index) => {
    const text= taskList[index].task
    setShowModal(true)
    setText(text)
  }
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Function to save tasklist to localstorage
  const saveTaskListToLocalStorage = (tasks) =>{
    localStorage.setItem("taskList", JSON.stringify(tasks) )
  } 

  // Function to get taskList from localStorage
  const getTaskListFromLocalStorage  = (tasks) =>{
    const savedTaskList = localStorage.getItem("taskList");
    if(savedTaskList) {
      setTaskList(JSON.parse(savedTaskList))
    }
  }

  useEffect(() => {
    // Load taskList from localStorage when component mounts
    getTaskListFromLocalStorage();
  }, []);

  const deleteTask = (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?")
    if(confirmed){
      setTaskList(prev => prev.filter((_, i) => i !== index))
    }
  }
  const createTask = () =>{
    if(text){
      const newTask = {
        task: text,
        completed: false
      };
      setTaskList(prev=>[...prev, newTask])
      setText("")
      setShowModal(false)
      // Save updated taskList to localStorage
      saveTaskListToLocalStorage([...taskList, newTask]);
    }else{
      alert("Type your task")
    } 

  }
  const completedTask = (index) =>{
    setTaskList(prev => {
      const updatedTasks = [...prev]
      updatedTasks[index] = {...updatedTasks[index], completed: !updatedTasks[index].completed}
      // Save updated taskList to localStorage
      saveTaskListToLocalStorage([...updatedTasks]);
      return updatedTasks
    })
  }
  useEffect(() => {
  }, [taskList]);
  return (
    <div className='relative bg-[url("./assets/pattern.svg")] flex items-center justify-center bg-cover w-100 min-h-[100vh]'>
      <div className='w-[500px] flex items-center justify-between pb-2 gap-8 flex-col min-h-[500px] sm:border-2 md:rounded-md'>
        <h2 className='text-center text-2xl sm:text-3xl text-white font-bold pt-8'>TODO LIST ✏️</h2>
        <ul className='border-x-2 border-t-2 w-[90%]'>
          {
            taskList.map((item, i)=>(
              <li key={i} className='flex gap-2 border-b-2 p-2 items-center'>
                <input type="checkbox" checked={item.completed} onClick={()=>completedTask(i)} className='border-none outline-none' />
                <span className={`text-md sm:text-lg flex-1 text-gray-100 font-semibold ${item.completed ? "line-through" : ""}`}>{item.task}</span>
                {/* <span className='cursor-pointer' onClick={()=>editTask(i)}>✏️</span> */}
                <span className='cursor-pointer' onClick={()=>deleteTask(i)}>❌</span>
              </li>
            ))
          }
          {
            taskList.length === 0 ? 
            <li className='flex gap-2 border-b-2 text-gray-100 font-semibold p-2 items-center'>No task </li> : null
          }
        </ul>
        <button onClick={()=>setShowModal(true)} className='cursor-pointer rounded-full bg-[#df6688] p-4'>➕</button>
      </div>


      {/* Popup */}
      {showModal ? (
        <>
          <div className="absolute rounded-lg transition-all ease-in-out delay-150 z-10 pb-4 bg-white shadow-lg md:w-96 w-64 ">
            <div className='flex p-4 items-center'>
              <h3 className='flex-1 text-lg text-black font-bold'>Task</h3>
              <span onClick={()=>setShowModal(false)} className='cursor-pointer'>❌</span>

            </div>
            <div className='w-100 flex p-2 flex-col gap-4 pt-4'>
              <input type="text" value={text} onChange={(e)=>setText(e.target.value)} placeholder='Write your task here' className='p-1 w-100 border-none outline-none' />
              <div className='w-100 flex items-center gap-2 flex-row-reverse'>
                <button onClick={createTask} className='bg-[#3d1053] text-sm p-2 border-2 border-[#3d1053] rounded-lg text-white font-semibold '>Create Task</button>
                <button onClick={()=>setShowModal(false)} className='bg-white text-sm p-2 border-[1px] border-[#3d1053] rounded-lg text-[#3d1053] font-semibold '>Cancel</button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default App
