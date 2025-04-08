import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import Navbar from "../src/components/Navbar"
import { MemoryRouter, Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { Provider } from "react-redux";
import { store } from "../src/reducers/store";
import { useMediaQuery } from "@uidotdev/usehooks";


//Mocks
vi.mock("axios");

const isLargeDevice = useMediaQuery("only screen and (min-width: 1040px)");

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
    it("Toggles the navbar on small screen", async() => {
        () => {
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: 800,
            });
        };

        // Toggle button to show nav 
        await userEvent.click(screen.getByTestId("navButton"));
        expect(screen.getByText("Home")).toBeInTheDocument();

        // Toggle button to hide nav
        await userEvent.click(screen.getByTestId("navButton"));
        expect(screen.queryByText("Home")).not.toBeInTheDocument();

    })})