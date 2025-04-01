import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import Preferences from "../src/components/mainpage/Preferences"
import { MemoryRouter, Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import authReducer, {User } from "../src/reducers/auth";
import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";

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
    },
    preloadedState: {
        auth: {
            isLoggedIn: true,
            user: mockUser, 
        },
    },
});

//Mocks
vi.mock("axios");


describe("Preferences page tests", () => {
    beforeAll(() => {
        HTMLCanvasElement.prototype.getContext = vi.fn();
    })
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Provider store={mockStore}>
                    <Preferences />
                </Provider>
            </MemoryRouter>
        )
    });
    afterEach(() => {
        cleanup();
    });
    it("Renders preferences page", () => {
        expect(screen.getByText("Set Your Preferences")).toBeInTheDocument();

        expect(screen.getByText("Add Fixed Task", {selector: "button"})).toBeInTheDocument();
        expect(screen.getByDisplayValue("Save Preferences")).toBeInTheDocument();
    });
    it("Opens new fixed task popup on button click", async() => {
        await userEvent.click(screen.getByText("Add Fixed Task", {selector: "button"}));

        expect(screen.getByText("Create Fixed Task")).toBeInTheDocument();
        expect(screen.getByText("End Time:")).toBeInTheDocument();
    });
    /* Test failing due to inability to change TimePicker value 
    it("New task shows in the list after being created", async() => {
        await userEvent.click(screen.getByText("Add Fixed Task", {selector: "button"}));

        //Fill new task form with info & submit
        await userEvent.type(screen.getByLabelText("Task Name:"), "Great Name");
        await userEvent.click(screen.getByLabelText("Monday"));
        await userEvent.click(screen.getByLabelText("Tuesday"));
        await userEvent.click(screen.getByDisplayValue("Save Task"));

        await waitFor(() => {
            expect(screen.getByText("No fixed tasks")).not.toBeInTheDocument();
          });
        
    });
    */
    it("Shows errors if incorrect form data for new task", async() => {
        //Submit form with no task name or days selected
        await userEvent.click(screen.getByText("Add Fixed Task", {selector: "button"}));
        await userEvent.click(screen.getByDisplayValue("Save Task"));

        expect(screen.getByText("Select at least one day")).toBeInTheDocument();
        expect(screen.getByText("Task name must be specified")).toBeInTheDocument();
    });
    it("Calls the api to save preferences", async() => {
        vi.spyOn(axios, "put").mockResolvedValue({ data: {} });
        localStorage.setItem("token", "dummyToken")
        //Send API request with token and page info
        await userEvent.click(screen.getByDisplayValue("Save Preferences"));
        expect(axios.put).toHaveBeenCalledWith("https://ordo-backend.fly.dev/user/preferences", 
            {
                "sleepStart": 1400,
                "sleepEnd": 8 * 60,
                "fixedTasks": [
                    {
                    "name": "Gym",
                    "day": [1],
                    "start": 18 * 60,
                    "end": 19 * 60,
                    }
                ]
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer dummyToken`,
                  }
            }
        )

    })
})