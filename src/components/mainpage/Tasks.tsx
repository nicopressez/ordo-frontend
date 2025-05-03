import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import axios from "axios";
import { refreshUserInfo } from "../../reducers/auth";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

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
    scheduledSessions?: [{_id: string, startTime: string, duration: number}],
    completedSessions?: [{startTime: string, duration: number}]
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

    const nav = useAppSelector(state => state.nav);
    const showNav = nav.showNav;

    const [tasks, setTasks] = useState<ReducedTask[]>([])

    const [newTaskForm, setNewTaskForm] = useState(false);
    const [editTaskForm, setEditTaskForm] = useState<[boolean, String]>([false, ""]);

    const [taskFormData, setTaskFormData] = useState<TaskFormData>(defaultFormData)
    const [formErrors, setFormErrors] = useState({name: false, duration: false});

    const [addSession, setAddSession] = useState(false);
    const [newSessionData, setNewSessionData] = useState({startTime: "", duration: 0})

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
    };

    const getTodaysDate = () => {
        //Get todays date in format yyyy-mm-ddThh-mm
        const today = new Date();
        const year = today.getFullYear();
        const month = ("0" + (today.getMonth() + 1)).slice(-2);
        const day = ("0" + (today.getDate() + 1)).slice(-2);
        const hours = ("0" + today.getHours()).slice(-2);
        const minutes = ("0" + today.getMinutes()).slice(-2);

        return `${year}-${month}-${day}T${hours}:${minutes}`
    };

    const toggleNewSession = (e : React.MouseEvent<HTMLButtonElement, MouseEvent> | null = null, toggle : boolean) => {
        if(toggle) {
            //Populate form data and open form
            e?.preventDefault();
            setNewSessionData({startTime: getTodaysDate(), duration: 1});
            setAddSession(true);
        }
        else {
            //Clean up data and close new session form
            e?.preventDefault();
            setAddSession(false);
            setNewSessionData({startTime: "", duration: 1});
        }
    };

    const deleteTask = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        //TODO: Delete task fn
    }

    const handleNewSession = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        axios.post(`https://ordo-backend.fly.dev/task/${editTaskForm[1]}/scheduled-sessions`, {
            "scheduledSessions" : [newSessionData]
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        }).then((res) => {
            dispatch(refreshUserInfo(res.data.token));

            //Update scheduled sessions 
            const updatedFormData = taskFormData
            updatedFormData.scheduledSessions?.push(
                {_id: res.data.task._id as string, startTime: newSessionData.startTime, duration: newSessionData.duration});
            setTaskFormData(updatedFormData)

            //Reset form
            toggleNewSession(null, false);
        }).catch((err) => {
            console.log(err)
            //TODO: Add error handling
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
        <div className="ml-[14%] bg-gray-100 h-screen w-screen lg:ml-[14%] p-5 font-rubik ">
            <div className="bg-white rounded-xl p-3 pl-5 pr-5 
            lg:p-10 lg:pr-20 lg:pl-20 lg:w-[65%] min-h-full text-lg ">
                <h1 className="font-bold text-2xl text-center mb-10 text-gray-900">
                    My tasks
                </h1>
                <p>Search task</p>
                <button onClick={() => setNewTaskForm(true)}
                    className="mt-3 hover:cursor-pointer font-bold hover:brightness-110">
                <FontAwesomeIcon icon={faPlus} className="text-indigo-500 mt-1 mr-1" size="sm"/>
                    Add New Task
                </button>
                {tasks[0] 
                ? 
                <div>
                <h2 className="text-xl font-bold mb-5 mt-10">
                <FontAwesomeIcon icon={faListCheck} size="sm"/>
                    Tasks:
                </h2>

                <div className="border-[3px] p-2 pl-4 pr-4 border-gray-100 rounded-lg mb-2 w-[48rem] text-lg">
                {tasks.map((task) => (
                    <>
                    <div key={task._id} onClick={() => toggleEditTask(task._id)}
                    className="hover:cursor-pointer"> 
                    <p className="inline font-bold">{task.name} </p>
                    <p className="inline">({task.completedHours}h / {task.totalHours}h completed)</p>
                    <button onClick={(e) => deleteTask(e)}
                        className="inline ml-3 text-red-600 ">
                        <FontAwesomeIcon icon={faXmark} size="sm" className="mt-1 mr-1"/>
                        Delete task
                    </button>
                    </div>
                    </>
                    )
        
                )
                }
                </div>
                
                </div>
                : (<p>No tasks</p>)
                }
            </div>
            <Transition show={newTaskForm || editTaskForm[0]}
                as="div"
                enter="transition-all duration-300"
                enterFrom="translate-x-40 opacity-0"
                enterTo="translate-x-0 opacity-100"
                leave="transition-all duration-300"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo="translate-x-40 opacity-0"
                className={`bg-white rounded-l-xl p-5 w-[80%] lg:w-[32%] fixed right-0 top-0 font-rubik h-full text-lg
                    ${showNav && "brightness-95 pointer-events-none"}`
                }>
                    <h2>
                        {newTaskForm
                            ? "Create Task"
                            : "Edit Task"
                        }
                    </h2>
                <form onSubmit={(e) => handleTaskSave(e)}
                    className="flex flex-col items-center">
                    {formErrors.name && 
                        <p className="text-red-500">
                            Task name must be defined and under 40 characters
                        </p>
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
                                    <p>{session.startTime}</p>
                                    <p>{session.duration}</p>
                                </div>
                            ))}
                          </div>
                        : <p>No scheduled sessions yet</p>
                        }
                        <button onClick={(e) => toggleNewSession(e, true)}>Add session</button>
                        {addSession && 
                        <form>
                            <label htmlFor="startTime">Date:
                                <input type="datetime-local" min={getTodaysDate()} value={newSessionData.startTime}
                                onChange={(e) => setNewSessionData(prevData => ({...prevData, startTime: e.target.value}))}
                                name="startTime" id="startTime"/>
                            </label>
                            <label htmlFor="sessionDuration">Duration (hours):
                                <input type="number" min={0} max={16} value={newSessionData.duration}
                                onChange={(e) => setNewSessionData(prevData => ({...prevData, duration: +(e.target.value)}))}
                                name="sessionDuration" id="sessionDuration"/>
                            </label>
                            <button onClick={(e) => {toggleNewSession(e,false)}}>Cancel</button>
                            <button onClick={(e) => handleNewSession(e)}>Add</button>
                        </form>}
                        {taskFormData.completedSessions?.[0] && 
                         <div>
                         <h1>Scheduled sessions</h1>
                         {taskFormData.completedSessions.map((session) => (
                             <div key={uuidv4()}>
                                 <p>{session.startTime}</p>
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