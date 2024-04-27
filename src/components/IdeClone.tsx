import React, { useEffect, useState } from "react";
import SampleSplitter from "./SampleSplitter";
import { useResizable } from "react-resizable-layout";
import { cn } from "../utils/cn";
// import "./../styles/IdeClone.css"
// import "@/styles/IdeClone.css";
import axios from "axios"

type EditTask = {
  id: string | null,
  title: string | null,
} | null

const IdeClone = (): JSX.Element => {
  const [newTask, setNewTask] = useState<string>("");
  const [tasks, setTasks] = useState([]);
  const [actionCount, setActionCount] = useState({
    add: 0,
    update: 0
  })
  const [editTask, setEditTask] = useState<EditTask>({
    id: null,
    title: null,
  })

  useEffect(()=> {
    getTasks();

  }, [])

  const getTasks = async () => {
    const data = await axios.get('/api/tasks');
    console.log("dataaaaa", data.data)
    setActionCount({
      add: data.data.addCount,
      update: data.data.updateCount,
    });
    setTasks(data.data.tasks)
  }

  const addTask = async () => {
    const task = await axios.post('/api/tasks', {
      title: newTask
    });
    if(task){
      getTasks();
      setNewTask("");
      alert("Item added")
    }
  }

  const updateTask = async () => {
    const task = await axios.put('/api/tasks', {
      id: editTask?.id,
      title: newTask
    })
    if(task) {
      getTasks();
      setNewTask("");
      setEditTask(null)
      alert("Item updated")
    }
  }

  const deleteTask = async (id: string) => {
    const result = confirm('Are you sure, you want to delete this task?')
    if(result) {
      const task = await axios.delete(`/api/tasks?id=${id}`)
      if (task) {
        getTasks();
        alert('task deleted')
      }
    }
  }

  const {
    isDragging: isTerminalDragging,
    position: terminalH,
    splitterProps: terminalDragBarProps
  } = useResizable({
    axis: "y",
    initial: 150,
    min: 50,
    reverse: true
  });
  const {
    isDragging: isFileDragging,
    position: fileW,
    splitterProps: fileDragBarProps
  } = useResizable({
    axis: "x",
    initial: 250,
    min: 50
  });
  const {
    isDragging: isPluginDragging,
    position: pluginW,
    splitterProps: pluginDragBarProps
  } = useResizable({
    axis: "x",
    initial: 200,
    min: 50,
    reverse: true
  });

  return (
    <div
      className={
        "flex flex-column h-screen bg-dark font-mono color-white overflow-hidden"
      }
    >
      <div className={"flex grow"}>
        <SampleSplitter isDragging={isFileDragging} {...fileDragBarProps} />
        <div
          className={cn("shrink-0 contents", isFileDragging && "dragging")}
          style={{ width: fileW }}
        >
          
        </div>
        <SampleSplitter isDragging={isFileDragging} {...fileDragBarProps} />
        <div className={"grow bg-darker contents"}>
          <div className="taskInput">
            <input className="input" value={newTask} placeholder="Add task" onChange={(e)=> setNewTask(e.target.value)} />
            <button className="btn1" onClick={editTask?.id ? updateTask : addTask}>
              {editTask?.id ? "Update": "Add"}
            </button>
          </div>
          {
            tasks.length > 0 && (
              <ul className="taskList">
            {
              tasks.map((task: any, index) => {
                return (
                  <li className="listItem" key={index}>
                    <div>
                      <span>
                       {task.title}
                      </span>
                      
                      <button className="btn2" onClick={()=> {
                        setNewTask(task.title)
                        setEditTask({id: task.id, title: task.title})
                      }}>Edit</button>
                      <button className="btn2" onClick={()=> deleteTask(task.id)}>Delete</button>
                    </div>
                  </li>
                )
              })
            }
          </ul>
            )
          }
          <div>
            Added: {actionCount.add} Updated: {actionCount.update}
          </div>
        </div>
      </div>
      <SampleSplitter
        dir={"horizontal"}
        isDragging={isTerminalDragging}
        {...terminalDragBarProps}
      />
      <div
        className={cn(
          "shrink-0 bg-darker contents",
          isTerminalDragging && "dragging"
        )}
        style={{ height: terminalH }}
      >
        Aryaman
        
      </div>
    </div>
  );
};

export default IdeClone;
