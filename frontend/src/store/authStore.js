import { create } from "zustand"
import axios from "axios"

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth"
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    error: null,
    isLoading: false,
    isAuthenticated: false,
    isCheckingAuth: false,

    signup: async (email, password, name) => {
        set({isLoading: true, error: null})
        try {
            const response = await axios.post(`${API_URL}/signup`, {
                email,
                password,
                name
            })
            set({user: response.data.user, isAuthenticated: true, isLoading:false})
        } catch (error) {
            set({error: error.response.data.message || "Error Signing Up", isLoading: false})
            throw new Error(error)
        }
    },
    verifyEmail: async (code) => {
        set({isLoading: true, error: null})
        try {
            const response = await axios.post(`${API_URL}/verify-email`, {
                code
            })
            set({user: response.data.user, isLoading: false, isAuthenticated: true})
        } catch (error) {
            set({error: error.response.data.message || "Error Verifiying Email", isLoading: false})
            throw new Error(error)
        }
    },
    login: async (email, password) => {
        set({isLoading: true, error: null})
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            })
            set({user: response.data.user, isLoading:false, isAuthenticated: true})
        } catch (error) {
            console.log(error)
            set({error: error.response.data.message || "Error logging in", isLoading: false})
            throw new Error(error)
        }
    },
    logout: async () => {
        set({isLoading: true, error:null})
        try {
            const response = await axios.post(`${API_URL}/logout`)
            set({user:null, isAuthenticated: false, isLoading: false})
        } catch (error) {
            set({error: error.response.data.message || "Error logging out", isLoading:false})
            throw new Error(error)
        }
    },
    checkAuth: async () => {
        set({isCheckingAuth: true, error:null})
        try {
            const response = await axios.get(`${API_URL}/check-auth`)

            set({user: response.data.user, isCheckingAuth: false, isAuthenticated: true})
        } catch (error) {
            set({error: null, isCheckingAuth:false})
        }
    }
}))