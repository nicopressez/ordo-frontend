import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import axios from "axios";
import { refreshUserInfo } from "../../reducers/auth";
import { v4 as uuidv4 } from 'uuid';

interface ReducedTask {
    active: boolean,
    completedHours: number,
    duration: number,
    name: string,
    totalHours: number
    _id: string,
}

interface TaskFormData {
    name: string,
    description: string,
    duration: number | undefined,
    priority: number,
    maxHoursPerSession: number | undefined,
    deadline: number | undefined,
    recurrent: boolean,
    scheduledSessions?: [{_id: string, startTime: Date, duration: number}],
    completedSessions?: [{startTime: Date, duration: number}]
}

const defaultFormData = {
        name:"",
        description: "",
        duration: undefined,
        priority: 2,
        maxHoursPerSession: undefined,
        deadline: undefined,
        recurrent: true,
}

const Tasks = () => {

    const dispatch = useAppDispatch();
    const auth = useAppSelector(state => state.auth)
    const user = auth.user

    const [tasks, setTasks] = useState<ReducedTask[]>([])

    const [newTaskForm, setNewTaskForm] = useState(false);
    const [editTaskForm, setEditTaskForm] = useState<[boolean, String]>([false, ""]);

    const [taskFormData, setTaskFormData] = useState<TaskFormData>(defaultFormData)
    const [formErrors, setFormErrors] = useState({name: false, duration: false})

    const handleTaskSave = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //Check for errors
        const checkErrors = {
            name: taskFormData.name.length === 0 || taskFormData.name.length > 40,
            duration: taskFormData.duration === (0 || undefined),
        }
        setFormErrors(checkErrors);
        if (Object.values(checkErrors).some(value => value)) return;
        //Create new task on DB
        if(newTaskForm) {
            axios.post("https://ordo-backend.fly.dev/task", {
                "tasks" : [taskFormData],
            } , {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            }).then((res) => {
                //Refresh user info to get updated tasks info
                dispatch(refreshUserInfo(res.data.token));
                handleCancelForm();
            }).catch((err) => {
                //TODO: Add error handling
                console.log(err)
            })
        }
        else if(editTaskForm[0]) {
            axios.put(`https://ordo-backend.fly.dev/task/${editTaskForm[1]}`, {
                ...taskFormData
            } , {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            }).then((res) => {
                dispatch(refreshUserInfo(res.data.token));
                handleCancelForm();
            }).catch((err) => {
                //TODO: Add error handling
                console.log(err)
            })
        }
    };

    const handleCancelForm = (e : React.MouseEvent<HTMLButtonElement, MouseEvent> | null = null) => {
        //Reset forms
        e?.preventDefault();
        setEditTaskForm([false, ""]);
        setNewTaskForm(false);
        setTaskFormData(defaultFormData);
    };

    const toggleEditTask = (id : String) => {
        axios.get(`https://ordo-backend.fly.dev/task/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        }).then((res) => {
            const responseData = res.data.task._doc;
            setEditTaskForm([true, id]);
            setTaskFormData({
                name:responseData.name,
                description: responseData.description,
                duration: responseData.duration,
                priority: responseData.priority,
                maxHoursPerSession: responseData.maxHoursPerSession,
                deadline: responseData.deadline,
                recurrent: responseData.recurrent,
                scheduledSessions: responseData.scheduledSessions,
                completedSessions: responseData.completedSessions
            });
        }).catch((err) => {
            //TODO: Add error handling
            console.log(err)
        })
    }

    useEffect(() => {
        if(user){
            axios.get("https://ordo-backend.fly.dev/task", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            }).then((res) => {
                const currentTasks = res.data.tasks
                setTasks(currentTasks);
            }).catch((err) => {
                //TODO: Add error handling
                console.log(err)
            })
        }
    },[user])

    if (!user) return (
        <div>
            Loading
        </div>
    )
    if (user) return (
        <div className="ml-[14%]">
            <div>
                <h1>My tasks</h1>
                <p>Search task</p>
                <button onClick={() => setNewTaskForm(true)}>
                    Add new task
                </button>
                {tasks[0] 
                ? 
                <div>
                <h1>Tasks:</h1>
                {tasks.map((task) => (
                    <div key={task._id} onClick={() => toggleEditTask(task._id)}>
                        <p>{task.name}</p>
                        <p>{task.completedHours} / {task.totalHours}</p>
                    </div>)
                )
                }
                </div>
                : (<p>No tasks</p>)
                }
            </div>
            <Transition show={newTaskForm || editTaskForm[0]}
                as="div">
                <form onSubmit={(e) => handleTaskSave(e)}>
                    {formErrors.name && 
                        <p>Task name must be defined and under 40 characters</p>
                    }
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
                    {formErrors.duration && 
                        <p>
                        Duration must be defined
                        </p>}
                    <label htmlFor="duration">
                        Duration:
                        <input type="number" 
                               min={0}
                               max={100}
                               name="duration" 
                               id="duration"
                               value={taskFormData.duration || ""}
                               onChange={(e) => setTaskFormData(prevData => ({...prevData, duration: +(e.target.value)}))}/>
                    </label>
                    <label htmlFor="priority">
                        Priority:
                        <select name="priority"
                                id="priority"
                                value={taskFormData.priority.toString() || ""}
                                onChange={(e) => setTaskFormData(prevData => ({...prevData, priority: +(e.target.value)}))}>
                            <option value="1">Low</option>
                            <option value="2">Medium</option>
                            <option value="3">High</option>
                        </select>
                    </label>
                    <label htmlFor="maxHoursPerSession">
                        Max session length:
                        <input type="number" 
                               min={1}
                               max={16}
                               name="maxHoursPerSession" 
                               id="maxHoursPerSession"
                               value={taskFormData.maxHoursPerSession || ""}
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
                            <option value="no">No</option>
                        </select>
                    </label>
                    {editTaskForm && 
                    <div>
                        {taskFormData.scheduledSessions?.[0] 
                        ? <div>
                            <h1>Scheduled sessions</h1>
                            {taskFormData.scheduledSessions.map((session) => (
                                <div key={session._id}>
                                    <p>{session.startTime.toDateString()}</p>
                                    <p>{session.duration}</p>
                                </div>
                            ))}
                          </div>
                        : <p>No scheduled sessions yet</p>
                        }
                        {taskFormData.completedSessions?.[0] && 
                         <div>
                         <h1>Scheduled sessions</h1>
                         {taskFormData.completedSessions.map((session) => (
                             <div key={uuidv4()}>
                                 <p>{session.startTime.toDateString()}</p>
                                 <p>{session.duration}</p>
                             </div>
                         ))}
                       </div>}
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