import React from "react";
import { cleanup, getByText, render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, beforeEach, describe,afterAll, expect, it, vi } from "vitest";
import Tasks from "../src/components/mainpage/Tasks"
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, {User } from "../src/reducers/auth";
import navReducer from "../src/reducers/nav"
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { configMocks, mockAnimationsApi } from 'jsdom-testing-mocks';

// Helper to create a fake AxiosResponse
function createMockResponse<T>(data: T): AxiosResponse<T> {
    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {},
      } as InternalAxiosRequestConfig
    }
  }

//Mock user
const mockUser: User = {
    name: "Test User",
    email: "test@example.com",
    password: "hashedpassword",
    schedules: [{ _id: "123" }],
    preferences: {
        sleep: {
            start: 1400, //"23h20"
            end: 8 * 60, 
        },
        fixedTasks: [
            {
                name: "Gym",
                day: [1],
                start: 18 * 60,
                end: 19 * 60,
            },
        ],
    },
    tasks: [{ _id: "456" }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _id: "user123",
};

//Mock user inside of auth reducer
const mockStore = configureStore({
    reducer: {
        auth: authReducer,
        nav: navReducer,
    },
    preloadedState: {
        auth: {
            isLoggedIn: true,
            user: mockUser, 
        },
    },
});

describe("Tasks page test", () => {
    beforeAll(() => {
        //HeadlessUI polyfill
        configMocks({beforeEach, afterEach, afterAll},)
        mockAnimationsApi();

        localStorage.setItem("token", "dummyToken")
        //API mocks
        vi.mock("axios");

        // Use vi.mocked to type the mock properly
        const mockedAxios = vi.mocked(axios, true)

        // Setup mock for .get
        mockedAxios.get.mockImplementation((url: string) => {
        if (url === "https://ordo-backend.fly.dev/task") {
            return Promise.resolve(
            createMockResponse({
                tasks: [
                {
                    active: true,
                    completedHours: 0,
                    duration: 10,
                    name: "Gym",
                    totalHours: 0,
                    _id: "task1"
                }
                ]
            })
            )
        }

        if (url === "https://ordo-backend.fly.dev/task/task1") {
            console.log("Gym called")
            return Promise.resolve(
            createMockResponse({
                task: 
                    {_doc:
                    {
                        name: "Gym",
                        description: "Gym description",
                        duration: 10,
                        priority: 2,
                        maxHoursPerSession: undefined,
                        deadline: undefined,
                        recurrent: true,
                        scheduledSessions: [],
                        completedSessions: [],}
                }
                
            })
            )
        }

        return Promise.reject(new Error(`Unhandled request: ${url}`))
        })
        })
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Provider store={mockStore}>
                    <Tasks/>
                </Provider>
            </MemoryRouter>
        )
    });
    afterEach(() => {
        cleanup();
    })
    it("Renders tasks component", () => {
        expect(screen.getByText("My tasks")).toBeInTheDocument();
        expect(screen.getByText("Add new task", {selector: "button"})).toBeInTheDocument();
    });
    it("Displays tasks returned by API", async () => {
        const taskName = await screen.findByText("Gym");
        expect(taskName).toBeInTheDocument();
      });
    it("Opens new task form on button click", async() => {
        await userEvent.click(screen.getByText("Add new task", {selector: "button"}))

        expect(screen.getByText("Task name:")).toBeInTheDocument();
        expect(screen.getByText("Duration:")).toBeInTheDocument();
    });
    it("Creates task and shows it in the list", async() => {
        vi.spyOn(axios, "post").mockResolvedValue({ data: {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
    "eyJ1c2VyIjp7Im5hbWUiOiJUZXN0IFVzZXIiLCJlbWFpbCI6InRlc3RAZW1haWwuY29tIn19." +
    "dummysignature"} });
        //Fill new task form && submit
        await userEvent.click(screen.getByText("Add new task", {selector: "button"}))
        await userEvent.type(screen.getByLabelText("Task name:"), "Side project");
        await userEvent.type(screen.getByLabelText("Duration:"), "12");
        await userEvent.selectOptions(screen.getByLabelText("Priority:"), "3");
        await userEvent.type(screen.getByLabelText("Max session length:"), "3");
        await userEvent.click(screen.getByDisplayValue("Save"));

        //Task now shows on dashboard
        expect(axios.post).toHaveBeenCalledWith("https://ordo-backend.fly.dev/task", {
            "tasks": [{
                "name": "Side project",
                "description": "",
                "duration": 12,
                "priority": 3,
                "maxHoursPerSession": 3,
                "deadline": undefined,
                "recurrent": true
            }]
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer dummyToken`,
              }})
    });
    it("Displays error message on wrong form input", async() => {
        //Fill new task form && submit
        await userEvent.click(screen.getByText("Add new task", {selector: "button"}))
        await userEvent.selectOptions(screen.getByLabelText("Priority:"), "3");
        await userEvent.type(screen.getByLabelText("Max session length:"), "3");
        await userEvent.click(screen.getByDisplayValue("Save"));

        expect(screen.getByText("Task name must be defined and under 40 characters")).toBeInTheDocument();
        expect(screen.getByText("Duration must be defined")).toBeInTheDocument();
    });
    it("Opens populated form to edit existing task", async() => {
        await waitFor(async() => {
            expect(screen.getByText("Gym")).toBeInTheDocument();
        }) 

        //Open gym form && check if form is populated
        await userEvent.click(screen.getByText("Gym"));
        expect(screen.getByLabelText("Task name:")).toHaveValue("Gym");
        expect(screen.getByLabelText("Description:")).toHaveValue("Gym description");
        expect(screen.getByLabelText("Duration:")).toHaveValue(10);

        //Edit task && submit form
        await userEvent.type(screen.getByLabelText("Task name:"), "Not gym")
        await userEvent.type(screen.getByLabelText("Description:"), "Not going to the gym");
        await userEvent.type(screen.getByLabelText("Duration:"), "5");
        await userEvent.click(screen.getByDisplayValue("Save"));

        expect(screen.getByText("Not gym")).toBeInTheDocument();
    })
})