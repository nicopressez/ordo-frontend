import { useState } from "react"

const Preferences = () => {

    const [tasks, setTasks] = useState([]);
    const [taskForm, setTaskForm] = useState(false);
    const [newTask, setNewTask] = useState({
        name:"",
        day:[],
        start:"",
        end:"",
    });

    return (
        <div className=" bg-gray-100 h-screen w-screen ml-[20%]">
            <h1>Set Your Preferences</h1>
            <form>
                <label htmlFor="sleepStart">
                    Sleep at:
                    <input name="sleepStart"
                           type="time"
                           id="sleepStart"/>
                </label>
                <label htmlFor="sleepEnd">
                    Wake up at:
                    <input name="sleepEnd" 
                           type="time"
                           id="sleepEnd"/>
                </label>
                <p>Fixed Tasks</p>
                <button onClick={(e) =>{ e.preventDefault(); setTaskForm(true)}}>
                    Add Fixed Task
                </button>
                <input type="submit" value="Save Preferences"/>
            </form>
            {taskForm && <div>
                <h2>Create Fixed Task</h2>
                <form>
                    <label htmlFor="name">
                        Task Name:
                        <input type="name"
                               name="name"
                               id="name"/>
                    </label>
                    <label>
                        Days:
                        <label htmlFor="1">
                            Monday
                            <input name="1"
                                   id="1"
                                   type="checkbox"/>
                        </label>
                        <label htmlFor="2">
                            Tuesday
                            <input name="2"
                                   id="2"
                                   type="checkbox"/>
                        </label>
                        <label htmlFor="3">
                            Wednesday
                            <input name="3"
                                   id="3"
                                   type="checkbox"/>
                        </label>
                        <label htmlFor="4">
                            Thursday
                            <input name="4"
                                   id="4"
                                   type="checkbox"/>
                        </label>
                        <label htmlFor="5">
                            Friday
                            <input name="5"
                                   id="5"
                                   type="checkbox"/>
                        </label>
                        <label htmlFor="6">
                            Saturday
                            <input name="6"
                                   id="6"
                                   type="checkbox"/>
                        </label>
                        <label htmlFor="0">
                            Sunday
                            <input name="0"
                                   id="0"
                                   type="checkbox"/>
                        </label>
                    </label>
                    <label htmlFor="start">
                        Start Time:
                        <input id="start"
                               name="start"
                               type="time"/>
                    </label>
                    <label htmlFor="end">
                        End Time:
                        <input 
                           id="end"
                           name="end"
                           type="time"/>
                    </label>
                    <button onClick={() => setTaskForm(false)}>Cancel</button>
                    <input type="submit" 
                           value="Save Task"/>
                </form>
            </div>}
            
        </div>
    )
}

export default Preferences