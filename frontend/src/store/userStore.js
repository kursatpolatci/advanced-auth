import { create } from "zustand"
import axios from "axios"

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/user" : "/api/user"
axios.defaults.withCredentials = true;

export const useUserStore = create((set) => ({
    isLoading: false,
    error: null,

    deleteAccount: async () => {
        set({isLoading: true, error:null})
        try {
            const response = await axios.delete(`${API_URL}/delete`)

            set({isLoading: false, error:null})
        } catch (error) {
            set({error: error.response.data.message || "Error Deleting Account", isLoading: false})
            throw new Error(error)
        }
    }
}))