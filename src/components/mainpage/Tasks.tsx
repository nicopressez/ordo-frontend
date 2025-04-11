import { Transition } from "@headlessui/react";
import { useState } from "react"

interface TaskFormData {
    name: string,
    description: string,
    duration: number | undefined,
    priority: number,
    maxHoursPerSession: number | undefined,
    deadline: number | undefined,
    recurrent: boolean
}

const defaultFormData = {
        name:"",
        description: "",
        duration: undefined,
        priority: 2,
        maxHoursPerSession: undefined,
        deadline: undefined,
        recurrent: false,
}

const Tasks = () => {

    const [tasks, setTasks] = useState()

    const [newTaskForm, setNewTaskForm] = useState(false);
    const [editTaskForm, setEditTaskForm] = useState(false);

    const [taskFormData, setTaskFormData] = useState<TaskFormData>(defaultFormData)

    const handleTaskSave = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO:Form error handling
        // TODO:Push to tasks
    };

    const handleCancelForm = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        //Reset forms
        e.preventDefault();
        setEditTaskForm(false);
        setNewTaskForm(false);
        setTaskFormData(defaultFormData);
    }

    // TODO:Load tasks on initial render
    return (
        <div className="ml-[14%]">
            <div>
                <h1>My tasks</h1>
                <p>Search task</p>
                <button onClick={() => setNewTaskForm(true)}>
                    Add new task
                </button>
                <p>
                    Display tasks here
                </p>
            </div>
            <Transition show={newTaskForm || editTaskForm}
                as="div">
                <form onSubmit={(e) => handleTaskSave(e)}>
                    <label htmlFor="name">
                        Task name:
                        <input type="text" 
                               name="name" 
                               id="name"
                               value={taskFormData.name}
                               onChange={(e) => setTaskFormData(prevData => ({...prevData, name: e.target.value}))}/>
                    </label>
                    <label htmlFor="description">
                        Description:
                        <input type="text" 
                               name="description" 
                               id="description"
                               value={taskFormData.description}
                               onChange={(e) => setTaskFormData(prevData => ({...prevData, description: e.target.value}))}/>
                    </label>
                    <label htmlFor="duration">
                        Duration:
                        <input type="number" 
                               min={0}
                               name="duration" 
                               id="duration"
                               value={taskFormData.duration}
                               onChange={(e) => setTaskFormData(prevData => ({...prevData, duration: +(e.target.value)}))}/>
                    </label>
                    <label htmlFor="priority">
                        Priority:
                        <select name="priority"
                                id="priority"
                                value={taskFormData.priority.toString()}
                                onChange={(e) => setTaskFormData(prevData => ({...prevData, priority: +(e.target.value)}))}>
                            <option value="1">Low</option>
                            <option value="2">Medium</option>
                            <option value="3">High</option>
                        </select>
                    </label>
                    <label htmlFor="maxHoursPerSession">
                        Max session length:
                        <input type="number" 
                               min={0}
                               name="maxHoursPerSession" 
                               id="maxHoursPerSession"
                               value={taskFormData.maxHoursPerSession}
                               onChange={(e) => setTaskFormData(prevData => ({...prevData, maxHoursPerSession: +(e.target.value)}))}
                               />
                    </label>
                    <label htmlFor="deadline">
                        Deadline:
                        <select name="deadline"
                                id="deadline"
                                value={taskFormData.deadline?.toString()}
                                onChange={(e) => setTaskFormData(prevData => ({...prevData, deadline: +(e.target.value)}))}>
                            <option value={undefined}>No deadline</option>
                            <option value="0">Sunday</option>
                            <option value="1">Monday</option>
                            <option value="2">Tuesday</option>
                            <option value="3">Wednesday</option>
                            <option value="4">Thursday</option>
                            <option value="5">Friday</option>
                            <option value="6">Saturday</option>
                        </select>
                    </label>
                    <label htmlFor="recurrent">
                        Recurrent:
                        <select name="recurrent"
                                id="recurrent"
                                value={taskFormData.recurrent ? "yes" : "no"}
                                onChange={(e) => setTaskFormData(prevData => 
                                ({...prevData, recurrent: e.target.value === "yes" ? true : false}))}>
                            <option value="yes">Yes</option>
                            <option selected value="no">No</option>
                        </select>
                    </label>
                    {editTaskForm && 
                    <div>
                        <p>
                            Scheduled sessions
                        </p>
                        <p>
                        Completed session
                        </p>
                    </div>}
                    <button onClick={(e) => handleCancelForm(e)}>
                        Cancel
                    </button>
                    <input type="submit" value="Save"/>
                </form>
            </Transition>
                
        </div>
    )
}

export default Tasks