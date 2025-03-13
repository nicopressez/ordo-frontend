import React from "react";
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event"
import Auth from "../src/components/auth/Auth.tsx"
import axios from "axios";

describe("Auth page tests", () => {
    beforeAll(() => {
        vi.mock("axios")  
    });
    beforeEach(() => {
        render(
            <Auth />
        );
    });
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });
    test("Auth page renders", () => {
        expect(screen.getByText("Log in")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });
    test("switches between login and signup component on button click", async() => {
        await userEvent.click(screen.getByText("Sign up", {selector: "button"}));

        // Check if switched to signup component
        const loginButton = screen.getByText("Log in", {selector: "button"});
        expect(loginButton).toBeInTheDocument();

        // Check if switches back to login component
        await userEvent.click(loginButton);
        expect(screen.getByText("Sign up", {selector: "button"})).toBeInTheDocument();
    });
    test("api call made with form inputs for login", async() => {

        vi.spyOn(axios, "post").mockResolvedValue({ data: { success: true } });
        // Fill login form
        await userEvent.type(screen.getByLabelText("Email"), "test@email.com");
        await userEvent.type(screen.getByLabelText("Password"), "validpassword");
        
        //Submit & check if API call made with correct data
        await userEvent.click(screen.getByPlaceholderText("Log in"));

        //Check if API was called with right params
        expect(axios.post).toHaveBeenCalledWith("https://ordo-backend.fly.dev/auth/login",  {
                email: "test@email.com",
                password: "validpassword"
        });
    });
    test("api call made with form inputs for signup", async() => {
        vi.spyOn(axios, "post").mockResolvedValue({ data: { success:true } });

        // Switch to signup component
        await userEvent.click(screen.getByText("Sign up", {selector: "button"}));

        // Fill signup form
        await userEvent.type(screen.getByLabelText("Name"), "John");
        await userEvent.type(screen.getByLabelText("Email"), "test@email.com");
        await userEvent.type(screen.getByLabelText("Password"), "validpassword");
        await userEvent.type(screen.getByLabelText("Repeat password"), "validpassword");
        await userEvent.click(screen.getByPlaceholderText("Sign up"))

        //Check if API was called with right params
        expect(axios.post).toHaveBeenCalledWith("https://ordo-backend.fly.dev/auth/signup", {
            name: "John",
            email: "test@email.com",
            password: "validpassword",
            repeatPassword: "validpassword"
        })
    });
    test("error appears on screen when logging in with invalid form", async() => {
        vi.spyOn(axios, "post").mockResolvedValue({ data: { success:true } });

        // Fill login form
        await userEvent.type(screen.getByLabelText("Email"), "inva");
        await userEvent.type(screen.getByLabelText("Password"), "pass");
        await userEvent.click(screen.getByPlaceholderText("Log in"));

        //Check if error appears && API not called
        expect(axios.post).not.toHaveBeenCalled();
        expect(screen.getByText("Invalid email or password. Please try again.")).toBeInTheDocument();
    });
    test("error appears on screen when signing up with invalid form", async() => {
        vi.spyOn(axios, "post").mockResolvedValue({ data: { success:true } });

        // Switch to signup component
        await userEvent.click(screen.getByText("Sign up", {selector: "button"}));

        // Fill signup form
        await userEvent.type(screen.getByLabelText("Name"), "John");
        await userEvent.type(screen.getByLabelText("Email"), "test@email.com");
        await userEvent.type(screen.getByLabelText("Password"), "validpassword");
        await userEvent.type(screen.getByLabelText("Repeat password"), "invalidpassword");
        await userEvent.click(screen.getByPlaceholderText("Sign up"));

        //Check if error appears && API not called
        expect(axios.post).not.toHaveBeenCalled();
        expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    })
})