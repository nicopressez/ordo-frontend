import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import Preferences from "../src/components/mainpage/Preferences"
import { MemoryRouter, Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "../src/reducers/store";


//Mocks
vi.mock("axios");


describe("Preferences page tests", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Provider store={store}>
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
        expect(screen.getByLabelText("Sleep at:")).toBeInTheDocument();
        expect(screen.getByLabelText("Wake up at:")).toBeInTheDocument();

        expect(screen.getByText("Add Fixed Task", {selector: "button"})).toBeInTheDocument();
        expect(screen.getByDisplayValue("Save Preferences")).toBeInTheDocument();
    });
    it("Opens new fixed task popup on button click", async() => {
        await userEvent.click(screen.getByText("Add Fixed Task", {selector: "button"}));

        expect(screen.getByText("Create Fixed Task")).toBeInTheDocument();
        expect(screen.getByLabelText("Task Name:")).toBeInTheDocument();
        expect(screen.getByLabelText("Start Time:")).toBeInTheDocument();
        expect(screen.getByText("End Time:")).toBeInTheDocument();
    })
})