import { useEffect, useState } from "react";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { useAppSelector } from "../../reducers/hooks";
import axios from "axios";
import { loginSuccess } from "../../reducers/auth";
import { useDispatch } from "react-redux";
import { faListCheck, faMoon, faPenToSquare, faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";

const Preferences = () => {

    const dispatch = useDispatch();
    const auth = useAppSelector((state => state.auth));
    const user = auth.user;

    const nav = useAppSelector(state => state.nav);
    const showNav = nav.showNav;

    const [sleepStart, setSleepStart] = useState("00:00");
    const [sleepEnd, setSleepEnd] = useState("00:00");

    const [preferencesSaved, setPreferencesSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [showNewForm, setShowNewForm] = useState(false);
    const [editingTask, setEditingTask] = useState<any>();

    const [tasks, setTasks] = useState<{name: string, day: number[], start:string, end:string}[]>([]);
    const [newTaskForm, setNewTaskForm] = useState(false);
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
            setTasks([...user.preferences.fixedTasks.map((task) => ({
                name: task.name,
                day: task.day,
                start: formatMinutesToString(task.start),
                end: formatMinutesToString(task.end)
            }))]);
        }
    },[user]);


    //Submit new preferences to API & update user
    const handleSubmitPreferences = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setFormErrors({api: false, taskDate: false, name: false, time:false, sleep:false});
        //Format hours for all tasks back to number and send API req
        const fixedTasks = tasks.map((task) => ({
            name: task.name, 
            day:task.day,
            start: stringToMinutes(task.start),
            end: stringToMinutes(task.end)
        }));

        setPreferencesSaved(false);

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
            setIsLoading(false);
            setPreferencesSaved(true);
            localStorage.setItem("token", res.data.token);
            dispatch(loginSuccess(res.data.token));  
        }).catch(() => {
            setIsLoading(false);
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
            const minutes = minutesFromMidnight % 60 || "00"
    
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

    const handleEditingTask = (index: number) => {
        setEditingTask(index);

        //Get this task data and append it to form 
        const data = {
            name: tasks[index].name,
            day: tasks[index].day,
            start: tasks[index].start,
            end: tasks[index].end
        };
        setTaskData(data);
    }

    //Edit current task
    const handleEditTask = (e : React.FormEvent<HTMLFormElement>) => {
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
        //Edit task in the tasks array
        const newTasks = tasks;
        newTasks.splice(editingTask, 1, taskData);
        setTasks(newTasks);
        //Reset & close form
        setEditingTask(null);
        clearNewTask();
    };

    const handleDeleteTask = (e: React.MouseEvent<SVGSVGElement, MouseEvent>,index:number) => {
        e.preventDefault();
        const newTasks = [...tasks];
        newTasks.splice(index, 1);
        setTasks(newTasks);
    }


    //Add/remove index of day from new task data
    const handleTaskDays = (e : React.ChangeEvent<HTMLInputElement>) => {
        const dayIndex = Number(e.target.name)
        setTaskData(prevData => 
            ({...prevData, day: e.target.checked 
                ? [...prevData.day, dayIndex]
                : prevData.day.filter(d => d!== dayIndex)}))
    };

    //Reset task data and close new task form
    const clearNewTask = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null = null) => {
        if (e) e.preventDefault();
        setShowNewForm(false);

        //Clear form data once the form is no longer visible
        setTimeout(() => {
            setFormErrors({api: false, taskDate: false, name: false, time:false, sleep:false});
            setNewTaskForm(false);
            setTaskData({
                name: "",
            day: [] as number[],
            start: "00:00",
            end: "23:59"
            });
        }, 300);
    }

    //Loading page
    if (!user) return (
        <div className= "bg-gray-100 h-screen w-screen lg:ml-[14%] p-5">
            <div className="bg-white rounded-xl p-3 pl-5 pr-5 lg:p-10 lg:pr-20 lg:pl-20 lg:w-[65%] min-h-full text-lg ">
            <p className="w-64 rounded-full mb-10  h-7 ml-auto mr-auto  bg-gradient-to-b from-gray-300 to-gray-400 animate-pulse"></p>
            <form className="flex flex-col items-center h-full" onSubmit={(e) => handleSubmitPreferences(e)}>
            <p className="w-48 rounded-full mb-5 h-6 ml-auto mr-auto bg-gradient-to-b from-gray-300 to-gray-400 animate-pulse"></p>
            <p className="w-96 rounded-full mb-2 h-8 ml-auto mr-auto bg-gradient-to-b from-gray-300 to-gray-400 animate-pulse"></p>
            <p className="w-96 rounded-full mb-2 h-8 ml-auto mr-auto bg-gradient-to-b from-gray-300 to-gray-400 animate-pulse"></p>
            <p className="w-48 rounded-full mt-10 mb-5 h-6 ml-auto mr-auto bg-gradient-to-b from-gray-300 to-gray-400 animate-pulse"></p>
            <p className="w-190 rounded-lg mb-2 h-100 ml-auto mr-auto bg-gradient-to-b from-gray-300 to-gray-400 animate-pulse"></p>
            <p className="w-44 rounded-full mt-3 h-7 ml-auto mr-auto bg-gradient-to-b from-gray-300 to-gray-400 animate-pulse"></p>
            <p className="w-52 rounded-2xl mt-9 mb-3 p-2 h-10 ml-auto mr-auto bg-gradient-to-b from-gray-300 to-gray-400 animate-pulse"></p>
            </form>
            </div>
            </div> 
    )
      

    if (user) return (
        <div className= {`bg-gray-100 h-screen w-screen lg:ml-[14%] p-5 font-rubik 
            ${(showNewForm || isLoading || showNav) && "bg-gray-200"}`}>
            <div className={`bg-white rounded-xl p-3 pl-5 pr-5 
            lg:p-10 lg:pr-20 lg:pl-20 lg:w-[65%] min-h-full text-lg 
                ${(showNewForm || isLoading || showNav) && "brightness-95 pointer-events-none"}`}>
            <h1 className="font-bold text-2xl text-center mb-10 text-gray-900">
                Set Your Preferences
            </h1>
            {preferencesSaved && 
            <p className=" text-center -mt-6 mb-2 text-indigo-500">
                New preferences saved successfully!
            </p>}
            {formErrors.api && (
                <p>An error occured, please try again</p>
            )}
            <form className="flex flex-col items-center h-full" onSubmit={(e) => handleSubmitPreferences(e)}>
                
                <h2 className="text-xl font-bold mb-5">
                    <FontAwesomeIcon icon={faMoon} className="text-indigo-500 mr-1" size="sm"/>
                Sleep Schedule
                </h2>
                <label htmlFor="sleepStart" id="sleepStartLabel" 
                className="border-[3px] p-1 pl-4 pr-4 border-gray-100 rounded-sm mb-2 w-75 lg:w-96 flex justify-between">
                    Sleep at:
                    <TimePicker onChange={(newValue) => setSleepStart(newValue || "00:00")}
                                value={sleepStart} id="sleepStart"
                                aria-labelledby="sleepStartLabel"
                                data-testid="sleep-start-time-picker"
                                disableClock
                                clearIcon
                                className=" -mr-8"/>
                </label>
                <label htmlFor="sleepEnd" id="sleepEndLabel"
                className="border-[3px] p-1 pl-4 pr-4 border-gray-100 rounded-sm mb-2 w-75 lg:w-96 flex justify-between">
                    Wake up at:
                    <TimePicker onChange={(newValue) => setSleepEnd(newValue || "00:00")}
                                value={sleepEnd} 
                                id="sleepEnd" 
                                aria-labelledby="sleepEndLabel"
                                data-testid="sleep-end-time-picker"
                                disableClock
                                clearIcon
                                className="-mr-8"
                                />
                </label>
                <h2 className="text-xl font-bold mb-5 mt-10">
                    <FontAwesomeIcon icon={faListCheck} className="text-indigo-500 mr-1" size="sm"/>
                Fixed Tasks
                </h2>
                {tasks[0] ?
                <table className="border-[3px] p-2 pl-4 pr-4 border-gray-100 rounded-lg mb-2 w-[48rem] text-lg">
                    {tasks.map((task, index) => (
                        <div className={`border-gray-100 p-2 flex items-center flex-col lg:flex-row justify-between ${index !== 0 && "border-t-2"}`}>
                            <p className="lg:w-32 font-bold">{task.name}</p>
                            <p className="lg:w-52 lg:text-center">{formatIndexToDays(task.day)}</p>
                            <p className="lg:w-32">({task.start} - {task.end})</p>
                            <div>
                            <FontAwesomeIcon className="mt-1 text-cyan-500 mr-3 hover:cursor-pointer" 
                            icon={faPenToSquare} onClick={() => {handleEditingTask(index); setShowNewForm(true)}} />
                            <FontAwesomeIcon className="text-red-600 font-bold mt-1 hover:cursor-pointer" 
                            icon={faX} onClick={(e) => {handleDeleteTask(e, index)}} 
                            data-testid="deleteTaskButton"/>
                            </div>
                        </div> 
                    ))}
                </table> :
                    (<p> No fixed tasks </p>)
                }
                <button onClick={(e) =>{ e.preventDefault(); setNewTaskForm(true); setShowNewForm(true)}}
                    className="mt-3 hover:cursor-pointer font-bold hover:brightness-110">
                    <FontAwesomeIcon icon={faPlus} className="text-indigo-500 mt-1 mr-1"/>
                    Add Fixed Task
                </button>
                <input type="submit" value="Save Preferences" className="mt-9 w-52 p-2 bg-indigo-400 rounded-2xl text-white
                        font-semibold hover:cursor-pointer hover:brightness-105 active:brightness-110 mb-3" />
            </form>
            </div>
            <Transition as="div" show={showNewForm} 
            enter="transition-all duration-300"
            enterFrom="translate-x-40 opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="transition-all duration-300"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="translate-x-40 opacity-0"
            className={`bg-white rounded-l-xl p-5 w-[80%] lg:w-[32%] fixed right-0 top-0 font-rubik h-full text-lg
                ${showNav && "brightness-95 pointer-events-none"}`
            }>
                <h2 className="font-bold text-2xl text-center mb-6 text-gray-900 mt-10"
                >{newTaskForm 
                    ? "Create Fixed Task"
                    : "Edit Fixed Task"}</h2>
                <form className="flex flex-col items-center" 
                onSubmit={newTaskForm ? (e) => handleNewTask(e) : (e) => handleEditTask(e)}>
                    {formErrors.name &&
                        <p className="text-red-500">Task name must be specified</p>}
                    <label className="text-center text-xl mb-10 mt-5 font-bold" htmlFor="name">
                        Task Name:
                        <input className="block border-[3px] rounded-sm p-1 pl-3 lg:w-72 border-gray text-lg mt-1 font-normal"
                               type="name"
                               name="name"
                               id="name"
                               onChange={(e) => setTaskData(prevData => ({...prevData, name: e.target.value}))}
                               value={taskData.name}/>
                    </label>
                    {formErrors.taskDate && 
                        <p className="text-red-500 -mt-5 mb-3">Select at least one day</p>}
                    <p className="text-center text-xl font-bold">
                        Days:</p>
                    <div className=" flex gap-1 lg:gap-2 mt-3 mb-10">
                        <label htmlFor="1">
                            <input name="1"
                                   id="1"
                                   type="checkbox"
                                   className="mr-1 accent-indigo-500 scale-110 text-lg"
                                   onChange={(e) => handleTaskDays(e)}
                                   checked={taskData.day.includes(1)}/>
                            Mon
                        </label>
                        <label htmlFor="2">
                            <input name="2"
                                   id="2"
                                   type="checkbox"
                                   className="mr-1 accent-indigo-500 scale-110"
                                   onChange={(e) => handleTaskDays(e)}
                                   checked={taskData.day.includes(2)}/>
                            Tue
                        </label>
                        <label htmlFor="3">
                            <input name="3"
                                   id="3"
                                   type="checkbox"
                                   className="mr-1 accent-indigo-500 scale-110"
                                   onChange={(e) => handleTaskDays(e)}
                                   checked={taskData.day.includes(3)}/>
                            Wed
                        </label>
                        <label htmlFor="4">
                            <input name="4"
                                   id="4"
                                   type="checkbox"
                                   className="mr-1 accent-indigo-500 scale-110"
                                   onChange={(e) => handleTaskDays(e)}
                                   checked={taskData.day.includes(4)}/>
                            Thu
                        </label>
                        <label htmlFor="5">
                            <input name="5"
                                   id="5"
                                   type="checkbox"
                                   className="mr-1 accent-indigo-500 scale-110"
                                   onChange={(e) => handleTaskDays(e)}
                                   checked={taskData.day.includes(5)}/>
                            Fri
                        </label>
                        <label htmlFor="6">
                            <input name="6"
                                   id="6"
                                   type="checkbox"
                                   className="mr-1 accent-indigo-500 scale-110"
                                   onChange={(e) => handleTaskDays(e)}
                                   checked={taskData.day.includes(6)}/>
                            Sat
                        </label>
                        <label htmlFor="0">
                            <input name="0"
                                   id="0"
                                   type="checkbox"
                                   className="mr-1 accent-indigo-500 scale-110"
                                   onChange={(e) => handleTaskDays(e)}
                                   checked={taskData.day.includes(0)}/>
                            Sun
                        </label>
                    </div>
                    
                    {formErrors.time && 
                        <p className="text-red-500 mb-3">Must last at least one minute</p>}
                    {formErrors.sleep && 
                        <p className="text-red-500 mb-3">Fixed task must not overlap with sleep</p>}
                    <div className="flex space-x-4 mb-5">
                        <span className="inline mr-10">
                            <p className="text-lg">
                                Start Time:
                            </p>
                            <div className="border-[3px] p-1 border-gray-100">
                                <TimePicker onChange={(newValue) => setTaskData(prevData => ({...prevData, start: newValue || "00:00"}))}
                                    value={taskData.start}
                                    disableClock
                                    clearIcon
                                    className="-mr-8"
                                    data-testid="task-start-time-picker"/>
                            </div>
                        </span>

                        <span className="inline">
                            <p className="text-lg">End Time:</p>
                                <div className="border-[3px] p-1 border-gray-100">
                                    <TimePicker onChange={(newValue) => setTaskData(prevData => ({...prevData, end: newValue || "00:00"}))}
                                        value={taskData.end}
                                        disableClock
                                        clearIcon
                                        data-testid="task-end-time-picker"
                                        className="-mr-8"
                                        />
                                </div>
                        </span>
                    </div>
                    <div className="mt-50 lg:mt-86">
                    <button onClick={(e) => clearNewTask(e)}
                    className="inline mt-3  text-red-500 mr-10 text-left hover:underline
                     hover:cursor-pointer hover:brightness-105 active:brightness-110 mb-3">
                        Cancel
                    </button>
                    <input type="submit" 
                           className=" inline mt-3 w-42 p-2 bg-indigo-400 rounded-2xl text-white
                            font-semibold hover:cursor-pointer hover:brightness-105 active:brightness-110 mb-3"
                           value="Save Task"/>
                    </div>
                </form>
            </Transition>
            
        </div>
    ) 
        
}
    

export default Preferences