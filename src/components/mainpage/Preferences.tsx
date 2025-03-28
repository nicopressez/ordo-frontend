import { useEffect, useState } from "react";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { useAppSelector } from "../../reducers/hooks";


const Preferences = () => {

    const auth = useAppSelector((state => state.auth));
    const user = auth.user;

    //Format in minutes from midnight to hours string - 1400 > "23:20"
    const formatMinutesToString = (minutesFromMidnight : number) => {
        const hours = Math.trunc(minutesFromMidnight / 60);
        const minutes = minutesFromMidnight % 60 

        return `${hours}:${minutes}`
    }

    //TODO : Format
    //Get the day from the index - 1 > "Monday"
    const formatIndexToDay = (day: number) => {
        if(day === 0) return "Sunday";
        if(day === 1) return "Monday";
        if(day === 2 )return "Tuesday";
        if(day === 3) return "Wednesday";
        if(day === 4) return "Thursday";
        if(day === 5) return "Friday";
        if(day === 6) return "Saturday";
    }

    const [sleepStart, setSleepStart] = useState("00:00");
    const [sleepEnd, setSleepEnd] = useState("00:00");

    const [tasks, setTasks] = useState<{name: string, day: number[], start:string, end:string}[]>([]);
    const [taskForm, setTaskForm] = useState(false);
    const [formErrors, setFormErrors] = useState({taskDate: false, name: false, time:false})
    const [taskData, setTaskData] = useState({
        name: "",
        day: [] as number[],
        start: "00:00",
        end: "00:00"
    });

    //Initialize form with user preferences
    useEffect(() => {
        if(user) {
            setSleepStart(formatMinutesToString(user.preferences.sleep.start));
            setSleepEnd(formatMinutesToString(user.preferences.sleep.end));
            const initialTasks = user.preferences.fixedTasks.map((task) => ({
                name: task.name,
                day: task.day,
                start: formatMinutesToString(task.start),
                end: formatMinutesToString(task.end)
            })
            )
            setTasks(initialTasks);
        }
    },[user]);

    //Submit new task and add it to fixed tasks
    const handleNewTask = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //Sanitize fields and set errors - return if any
        const checkErrors = {
            name: taskData.name.length < 1,
            taskDate: !taskData.day.length,
            time: taskData.start === taskData.end
        };
        setFormErrors(checkErrors);
        if(Object.values(checkErrors).some(value => value)) return;
        //Append new task to fixed tasks
        //TODO: Return index days in order
        setTasks(prevData => ([...prevData, {
            name: taskData.name,
            day: taskData.day,
            start: taskData.start,
            end: taskData.end
        }]));
        //Reset & close form
        cancelNewTask();
    };


    //Add/remove index of day from new task data
    const handleTaskDays = (e : React.ChangeEvent<HTMLInputElement>) => {
        const dayIndex = Number(e.target.name)
        setTaskData(prevData => 
            ({...prevData, day: e.target.checked 
                ? [...prevData.day, dayIndex]
                : prevData.day.filter(d => d!== dayIndex)}))
    };

    //Reset task data and close new task form
    const cancelNewTask = () => {
        setFormErrors({taskDate: false, name: false, time:false});
        setTaskForm(false);
        setTaskData({
            name: "",
        day: [] as number[],
        start: "00:00",
        end: "00:00"
        });
    }

    if(!user) return (
        <h1> Loading</h1>
    )
      

    if (user) return (
        <div className=" bg-gray-100 h-screen w-screen ml-[20%]">
            <h1>Set Your Preferences</h1>
            <form>
                <label htmlFor="sleepStart" id="sleepStartLabel">
                    Sleep at:
                    <TimePicker onChange={(newValue) => setSleepStart(newValue || "00:00")}
                                value={sleepStart} id="sleepStart"
                                aria-labelledby="sleepStartLabel"
                                data-testid="sleep-start-time-picker"/>
                </label>
                <label htmlFor="sleepEnd" id="sleepEndLabel">
                    Wake up at:
                    <TimePicker onChange={(newValue) => setSleepEnd(newValue || "00:00")}
                                value={sleepEnd} 
                                id="sleepEnd" 
                                aria-labelledby="sleepEndLabel"
                                data-testid="sleep-end-time-picker"/>
                </label>
                <p>Fixed Tasks</p>
                {tasks && 
                    tasks.map((task) => (
                        <div>
                            <p>{task.name}</p>
                            <p>{task.day.map(day => formatIndexToDay(day) + " ")}</p>
                            <p>{task.start}</p>
                            <p>{task.end}</p>
                        </div>
                    ))
                }
                <button onClick={(e) =>{ e.preventDefault(); setTaskForm(true)}}>
                    Add Fixed Task
                </button>
                <input type="submit" value="Save Preferences"/>
            </form>
            {taskForm && <div>
                <h2>Create Fixed Task</h2>
                <form onSubmit={(e) => handleNewTask(e)}>
                    {formErrors.name &&
                        <p>Task name must be specified</p>}
                    <label htmlFor="name">
                        Task Name:
                        <input type="name"
                               name="name"
                               id="name"
                               onChange={(e) => setTaskData(prevData => ({...prevData, name: e.target.value}))}
                               value={taskData.name}/>
                    </label>
                    {formErrors.taskDate && 
                        <p>Select at least one day</p>}
                    <label>
                        Days:
                        <label htmlFor="1">
                            Monday
                            <input name="1"
                                   id="1"
                                   type="checkbox"
                                   onChange={(e) => handleTaskDays(e)}/>
                        </label>
                        <label htmlFor="2">
                            Tuesday
                            <input name="2"
                                   id="2"
                                   type="checkbox"
                                   onChange={(e) => handleTaskDays(e)}/>
                        </label>
                        <label htmlFor="3">
                            Wednesday
                            <input name="3"
                                   id="3"
                                   type="checkbox"
                                   onChange={(e) => handleTaskDays(e)}/>
                        </label>
                        <label htmlFor="4">
                            Thursday
                            <input name="4"
                                   id="4"
                                   type="checkbox"
                                   onChange={(e) => handleTaskDays(e)}/>
                        </label>
                        <label htmlFor="5">
                            Friday
                            <input name="5"
                                   id="5"
                                   type="checkbox"
                                   onChange={(e) => handleTaskDays(e)}/>
                        </label>
                        <label htmlFor="6">
                            Saturday
                            <input name="6"
                                   id="6"
                                   type="checkbox"
                                   onChange={(e) => handleTaskDays(e)}/>
                        </label>
                        <label htmlFor="0">
                            Sunday
                            <input name="0"
                                   id="0"
                                   type="checkbox"
                                   onChange={(e) => handleTaskDays(e)}/>
                        </label>
                    </label>
                    {formErrors.time && 
                        <p>Must last at least one minute</p>}
                    <label htmlFor="start">
                        Start Time:
                        <TimePicker onChange={(newValue) => setTaskData(prevData => ({...prevData, start: newValue || "00:00"}))}
                                value={taskData.start}
                                maxTime={taskData.end}
                                disableClock
                                data-testid="task-start-time-picker"/>
                    </label>
                    <label htmlFor="end">
                        End Time:
                        <TimePicker onChange={(newValue) => setTaskData(prevData => ({...prevData, end: newValue || "00:00"}))}
                                value={taskData.end}
                                minTime={taskData.start}
                                disableClock
                                data-testid="task-end-time-picker"/>
                    </label>
                    <button onClick={cancelNewTask}>
                        Cancel
                    </button>
                    <input type="submit" 
                           value="Save Task"/>
                </form>
            </div>}
            
        </div>
    )
}

export default Preferences