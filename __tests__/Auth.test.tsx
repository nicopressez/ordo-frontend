import React from "react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event"
import Auth from "../src/components/auth/Auth.tsx"

describe("Auth page tests", () => {
    beforeEach(() => {
        render(
            <Auth />
        );
    });
    afterEach(() => {
        cleanup();
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


    })
})