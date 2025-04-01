import { useEffect, useState } from "react";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { useAppSelector } from "../../reducers/hooks";
import axios from "axios";
import { loginSuccess } from "../../reducers/auth";
import { useDispatch } from "react-redux";


const Preferences = () => {

    const dispatch = useDispatch();
    const auth = useAppSelector((state => state.auth));
    const user = auth.user;

    const [sleepStart, setSleepStart] = useState("00:00");
    const [sleepEnd, setSleepEnd] = useState("00:00");

    const [tasks, setTasks] = useState<{name: string, day: number[], start:string, end:string}[]>([]);
    const [taskForm, setTaskForm] = useState(false);
    const [formErrors, setFormErrors] = useState({api: false,taskDate: false, name: false, time:false, sleep:false})
    const [taskData, setTaskData] = useState({
        name: "",
        day: [] as number[],
        start: "00:00",
        end: "23:59"
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


    //Submit new preferences to API & update user
    const handleSubmitPreferences = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormErrors({api: false, taskDate: false, name: false, time:false, sleep:false});
        //Format hours for all tasks back to number and send API req
        const fixedTasks = tasks.map((task) => ({
            name: task.name, 
            day:task.day,
            start: stringToMinutes(task.start),
            end: stringToMinutes(task.end)
        }));

        axios.put("https://ordo-backend.fly.dev/user/preferences", {
            fixedTasks,
            "sleepStart": stringToMinutes(sleepStart),
            "sleepEnd": stringToMinutes(sleepEnd)
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
              }
        }).then((res) => {
            //Update token 
            localStorage.setItem("token", res.data.token);
            dispatch(loginSuccess(res.data.token));  
        }).catch(() => {
            //Add API error
            const checkErrors = {
                api: true,
                name: false,
                taskDate: false,
                time: false,
                sleep: false,
            };
            setFormErrors(checkErrors);
        })
    }
    //Check if a fixed task overlaps with sleep
        const isTaskDuringSleep = (start : string, end: string) => {
            var taskOverlaps = false;
            //Get all hour string in minutes integer
            const taskStartMin = stringToMinutes(start);
            const taskEndMin = stringToMinutes(end);
            const sleepStartMin = stringToMinutes(sleepStart);
            const sleepEndMin = stringToMinutes(sleepEnd);

            if(sleepEndMin < sleepStartMin) {
                //Sleep spans midnight 
                const lastMinuteOfDay = 1439;
                taskOverlaps =  (taskStartMin >= sleepStartMin && taskStartMin <= lastMinuteOfDay) || // Task starts in night segment
                       (taskEndMin > sleepStartMin && taskEndMin <= lastMinuteOfDay) || // Task ends in night segment
                       (taskStartMin >= 0 && taskStartMin <= sleepEndMin) ||// Task starts in morning segment
                       (taskEndMin >= 0 && taskEndMin <= sleepEndMin) || // Task ends in morning segment
                       (taskStartMin < sleepStartMin && taskEndMin > sleepEndMin && taskEndMin < taskStartMin) // Task fully covers sleep

                return taskOverlaps;
            } else {
                //Normal sleep (same day)
                taskOverlaps = (taskStartMin >= sleepStartMin && taskStartMin < sleepEndMin) ||  //Task start between sleep
                (taskEndMin > sleepStartMin && taskEndMin <= sleepEndMin) ||  //Task end between sleep
                (taskStartMin < sleepStartMin && taskEndMin > sleepEndMin); // Task starts before sleep, ends after sleep
                return taskOverlaps;
            }
        }

        // Get time in string and format to minutes integer - "23:20" > 1400
        const stringToMinutes = (time : string) => {
            const hour = Number(time.split(":")[0])
            const minutes = Number(time.split(":")[1])

            return hour * 60 + minutes
        }

        //Format in minutes from midnight to hours string - 1400 > "23:20"
        const formatMinutesToString = (minutesFromMidnight : number) => {
            const hours = Math.trunc(minutesFromMidnight / 60);
            const minutes = minutesFromMidnight % 60 
    
            return `${hours}:${minutes}`
        }
    
        //Return a sorted string of days from day indexes 
        const formatIndexToDays = (days: number[]) => {
            var daysString = "";
            const daysForSort = [...days]
            const daysInOrder = daysForSort.sort((a,b) => { return a - b} );
            //Add 3-letter day to string with comma if not first of the list
            const appendDayToString = (d : String) => daysString+= daysString.length > 0 ? `, ${d}` : `${d}`;
            daysInOrder.map(day => {
                if(day === 0) appendDayToString("Sun");
                if(day === 1) appendDayToString("Mon");
                if(day === 2) appendDayToString("Tue");
                if(day === 3) appendDayToString("Wed");
                if(day === 4) appendDayToString("Thu");
                if(day === 5) appendDayToString("Fri");
                if(day === 6) appendDayToString("Sat");
            });
            return daysString;
        }

    //Submit new task and add it to fixed tasks
    const handleNewTask = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //Sanitize fields and set errors - return if any
        const checkErrors = {
            api: false,
            name: taskData.name.length < 1,
            taskDate: !taskData.day.length,
            time: taskData.start === taskData.end,
            sleep: isTaskDuringSleep(taskData.start, taskData.end)
        };
        setFormErrors(checkErrors);
        if(Object.values(checkErrors).some(value => value)) return;
        //Append new task to fixed tasks
        setTasks(prevData => ([...prevData, {
            name: taskData.name,
            day: taskData.day,
            start: taskData.start,
            end: taskData.end
        }]));
        //Reset & close form
        clearNewTask();
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
    const clearNewTask = () => {
        setFormErrors({api: false, taskDate: false, name: false, time:false, sleep:false});
        setTaskForm(false);
        setTaskData({
            name: "",
        day: [] as number[],
        start: "00:00",
        end: "23:59"
        });
    }

    if(!user) return (
        <h1> Loading</h1>
    )
      

    if (user) return (
        <div className=" bg-gray-100 h-screen w-screen ml-[20%]">
            <h1>Set Your Preferences</h1>
            {formErrors.api && (
                <p>An error occured, please try again</p>
            )}
            <form onSubmit={(e) => handleSubmitPreferences(e)}>
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
                {tasks[0] ?
                    tasks.map((task) => (
                        <div>
                            <p>{task.name}</p>
                            <p>{formatIndexToDays(task.day)}</p>
                            <p>({task.start} - {task.end})</p>
                        </div> 
                    )) :
                    (<p> No fixed tasks </p>)
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
                    {formErrors.sleep && 
                        <p>Fixed task must not overlap with sleep</p>}
                    <label htmlFor="start">
                        Start Time:
                        <TimePicker onChange={(newValue) => setTaskData(prevData => ({...prevData, start: newValue || "00:00"}))}
                                value={taskData.start}
                                disableClock
                                data-testid="task-start-time-picker"/>
                    </label>
                    <label htmlFor="end">
                        End Time:
                        <TimePicker onChange={(newValue) => setTaskData(prevData => ({...prevData, end: newValue || "00:00"}))}
                                value={taskData.end}
                                disableClock
                                data-testid="task-end-time-picker"/>
                    </label>
                    <button onClick={clearNewTask}>
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