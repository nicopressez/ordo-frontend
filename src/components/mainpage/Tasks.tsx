import { Transition } from "@headlessui/react";
import { useState } from "react"

const Tasks = () => {

    const [tasks, setTasks] = useState()

    const [newTaskForm, setNewTaskForm] = useState(false);
    const [editTaskForm, setEditTaskForm] = useState(false);

    // Load tasks on initial render
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
                <form>
                    <label htmlFor="name">
                        Task name:
                        <input type="text" name="name" id="name"/>
                    </label>
                    <label htmlFor="description">
                        Description:
                        <input type="text" name="description" id="description"/>
                    </label>
                    <label htmlFor="duration">
                        Duration:
                        <input type="number" name="duration" id="duration"/>
                    </label>
                    <label htmlFor="priority">
                        Priority:
                        <select name="priority" id="priority">
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                        </select>
                    </label>
                    <label htmlFor="maxHoursPerSession">
                        Max session length:
                        <input type="number" name="maxHoursPerSession" id="maxHoursPerSession"/>
                    </label>
                    <label htmlFor="deadline">
                        Deadline:
                        <select name="deadline" id="deadline">
                            <option selected value={undefined}>No deadline</option>
                            <option value={0}>Sunday</option>
                            <option value={1}>Monday</option>
                            <option value={2}>Tuesday</option>
                            <option value={3}>Wednesday</option>
                            <option value={4}>Thursday</option>
                            <option value={5}>Friday</option>
                            <option value={6}>Saturday</option>
                        </select>
                    </label>
                    <label htmlFor="recurrent">
                        Recurrent:
                        <select name="recurrent" id="recurrent">
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
                    <button onClick={(e) => {e.preventDefault(); setEditTaskForm(false); setNewTaskForm(false)}}>
                        Cancel
                    </button>
                    <input type="submit" value="Save"/>
                </form>
            </Transition>
                
        </div>
    )
}

export default Tasks