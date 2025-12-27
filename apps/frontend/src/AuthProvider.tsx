import { API_URL, User, UserType } from "@lib/api";
import { Routes } from "@route/Routes";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type AuthContext = AuthState & AuthFunctions;
const AuthContext = createContext<AuthContext | null>(null);

export interface AuthState {
	user?: User;
  role?: UserType;
	isLoading: boolean;
	error?: Error;
}

export interface AuthFunctions {
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

export default function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [authState, setAuthState] = useState<AuthState>({
		user: undefined,
    role: undefined,
		isLoading: true,
		error: undefined
	});

	const fetchUserData = useCallback(() => {
		fetch(API_URL + Routes.User.GetCurrent, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) throw new Error("Not authenticated");
				return response.json();
			})
			.then(data => data as User)
			.then(user => {
				setAuthState({
					user: user,
          role: undefined,
					isLoading: false,
					error: undefined
				});
			})
			.catch(error => {
				setAuthState({
					user: undefined,
          role: undefined,
					isLoading: false,
					error: error
				});
			});

      fetch(API_URL + Routes.User.GetUserRole, {
        credentials: "include"
      })
      .then(response => {
          if (!response.ok) throw new Error("Not authenticated");
          return response.json();
      })
      .then(data => data as UserType)
      .then(role => {
          setAuthState(prev => {
              return {
                user: prev.user,
                role: role,
                isLoading: false,
                error: undefined
              }
          })
      })
      .catch(error => {
          setAuthState(prev => {
              return {
                user: prev.user,
                role: undefined,
                isLoading: false,
                error: error
              }
          })
      })
	}, []);

	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);

	const login = useCallback(async (email: string, password: string) => {
		setAuthState({
			user: undefined,
			isLoading: true,
			error: undefined
		});

		const response = await fetch(API_URL + Routes.Identity.PostLogin + "?useCookies=true", {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password })
		});

		if (!response.ok) {
			setAuthState({
				user: undefined,
				isLoading: false,
				error: new Error(String(response.status))
			});
			return;
		}

		fetchUserData();
	}, [fetchUserData]);
	const logout = useCallback(async () => {
		await fetch(API_URL + Routes.Identity.PostLogout, {
			method: "POST",
			credentials: "include"
		})
			.then(_response => {
				setAuthState({
					user: undefined,
					isLoading: false,
					error: undefined
				});
			})
			.catch(console.error);
	}, []);

	const currentUserData: AuthContext = useMemo(() => {
		return { ...authState, login, logout };
	}, [login, logout, authState]);
	return (
		<>
			<AuthContext.Provider value={currentUserData}>
				{children}
			</AuthContext.Provider>
		</>
	);
}
