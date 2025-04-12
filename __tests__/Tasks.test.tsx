import React from "react";
import { cleanup, getByText, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, beforeEach, describe,afterAll, expect, it, vi } from "vitest";
import Tasks from "../src/components/mainpage/Tasks"
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, {User } from "../src/reducers/auth";
import navReducer from "../src/reducers/nav"
import axios from "axios";
import { configMocks, mockAnimationsApi } from 'jsdom-testing-mocks';

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
        axios.get = vi.fn().mockResolvedValue({
            data: {
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
            }
          });
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
                "recurrent": false
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
        await userEvent.click(screen.getByText("Gym"))
        
    })
})