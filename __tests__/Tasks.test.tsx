import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import Tasks from "../src/components/mainpage/Tasks"
import { MemoryRouter, Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "../src/reducers/store";

describe("Tasks page test", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Provider store={store}>
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
    it("Opens new task form on button click", async() => {
        await userEvent.click(screen.getByText("Add new task", {selector: "button"}))

        expect(screen.getByText("Task name:")).toBeInTheDocument();
        expect(screen.getByText("Duration:")).toBeInTheDocument();
    });
    it("Creates task and shows it in the list", async() => {
        //Fill new task form && submit
        await userEvent.click(screen.getByText("Add new task", {selector: "button"}))
        await userEvent.type(screen.getByLabelText("Task name:"), "Side project");
        await userEvent.type(screen.getByLabelText("Duration:"), "12");
        await userEvent.selectOptions(screen.getByLabelText("Priority:"), "3");
        await userEvent.type(screen.getByLabelText("Max session length:"), "3");
        await userEvent.click(screen.getByDisplayValue("Save"));

        //Task now shows on dashboard
        expect(screen.getByText("Side project")).toBeInTheDocument();
    })
} )