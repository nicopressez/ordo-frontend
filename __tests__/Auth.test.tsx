import React from "react";
import { afterEach, beforeEach, describe } from "vitest";
import '@testing-library/jest-dom/vitest';
import { cleanup, render } from "@testing-library/react";
import Auth from "../src/components/Auth"

describe("Auth page tests", () => {
    beforeEach(() => {
        render(
            <Auth />
        )
    })
    afterEach(() => {
        cleanup();
    })
})