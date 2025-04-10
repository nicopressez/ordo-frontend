import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import Navbar from "../src/components/Navbar"
import { MemoryRouter, Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "../src/reducers/store";



//Mocks
vi.mock("axios");

var isLargeDevice = true;

describe("Navbar tests", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Provider store={store}>
                    <Navbar isLargeDevice={isLargeDevice}/>
                </Provider>
            </MemoryRouter>
        )
    });
    afterEach(() => {
        cleanup();
    });
    it("Renders navbar", () => {
        expect(screen.getByText("Home")).toBeInTheDocument();
    });
    it("Clears token when clicking logout button", async() => {
        const logoutButton = screen.getByText("Logout");
        localStorage.setItem("token", "dummyToken");

        await userEvent.click(logoutButton);

        expect(localStorage.getItem("token")).toBe(null)
    });
})