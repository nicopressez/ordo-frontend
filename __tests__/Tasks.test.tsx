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
    it("Renders tasks component", () => {
        expect(screen.getByText("My tasks")).toBeInTheDocument();
        expect(screen.getByText("Add new task")).toBeInTheDocument();
    });
    it("Opens new task form on button click", async() => {
        await userEvent.click(screen.getByText("Add new task"))

        expect(screen.getByText("Task name")).toBeInTheDocument();
        expect(screen.getByText("Duration")).toBeInTheDocument();
    } )
} )