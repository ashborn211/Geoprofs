import { render, screen } from "@testing-library/react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import ProtectedRoute from "@/components/ProtectedRoute";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("@/context/UserContext", () => ({
  useUser: jest.fn(),
}));

describe("ProtectedRoute Unit Test", () => {
  const mockRouterPush = jest.fn();
  const mockUseRouter = useRouter as jest.Mock;
  const mockUsePathname = usePathname as jest.Mock;
  const mockUseUser = useUser as jest.Mock;

  beforeEach(() => {
    mockUseRouter.mockReturnValue({ push: mockRouterPush });
    mockUsePathname.mockReturnValue("/protected");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to '/' when user is not logged in", () => {
    mockUseUser.mockReturnValue({ user: null, isLoading: false });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockRouterPush).toHaveBeenCalledWith("/");
  });

  it("does not redirect when user is logged in", () => {
    mockUseUser.mockReturnValue({ user: { uid: "123" }, isLoading: false });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it("shows loading state while authentication is in progress", () => {
    mockUseUser.mockReturnValue({ user: null, isLoading: true });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it("does not redirect when user is on '/' path even if logged out", () => {
    mockUseUser.mockReturnValue({ user: null, isLoading: false });
    mockUsePathname.mockReturnValue("/");

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockRouterPush).not.toHaveBeenCalled();
  });
});
