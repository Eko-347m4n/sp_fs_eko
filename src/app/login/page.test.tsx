// src/app/login/testpage.test.tsx
import { render, waitFor } from "@testing-library/react";
import LoginPage from "./page"; // ganti dengan path login page kamu
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// 1) Mock next/router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// 2) Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

describe("LoginPage", () => {
  it("redirects to protected page if session exists", async () => {
    const pushMock = jest.fn();
    // 3) Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    // 4) Setup session mock: simulate already logged-in user
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: "John Doe" } },
      status: "authenticated",
    });

    render(<LoginPage />);

    // 5) Wait for redirect
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/protected");
    });
  });

  it("renders login form if no session", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    const { getByText } = render(<LoginPage />);
    expect(getByText("Login")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
