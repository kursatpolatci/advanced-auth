import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { motion } from "framer-motion"

import { useAuthStore } from "../store/authStore"
import { useUserStore } from "../store/userStore";

import { formatDate } from "../utils/date";

function DashboardPage() {

  const { logout, isLoading, user } = useAuthStore();
  const { deleteAccount, isLoading: isDeleting } = useUserStore()

  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login")
    } catch (error) {
      console.error(error)
    }
  }
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount()
      await logout()
      navigate("/login")
    } catch (error) {
      console.error(error)
    } 
  }
  return (
    <motion.div
      initial={{opacity:0,scale:0.9}}
      animate={{opacity:1,scale:1}}
      exit={{opacity:0, scale:0.9}}
      transition={{duration:0.5}}
      className="max-w-md w-full p-8 bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
    >
      <h2 className="text-center font-bold text-3xl mb-6 bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">Dashboard</h2>
    
      <div className="space-y-5">
        <motion.div
          initial={{opacity:0, y:20}}
          animate={{opacity:1, y:0}}
          transition={{duration: 0.2}}
          className="bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 p-4"
        >
          <h3 className="text-xl font-semibold text-green-400 mb-3">Profile Information</h3>
          <p className="text-gray-300">Name: {user?.name}</p>
          <p className="text-gray-300">Email: {user?.email}</p>
        </motion.div>
        <motion.div
          initial={{opacity:0, y:20}}
          animate={{opacity:1, y:0}}
          transition={{duration: 0.4}}
          className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
        >
          <h3 className="text-xl font-semibold text-green-400 mb-3">Account Activity</h3>
          <p className="text-gray-300">
            <span className="font-bold">Joined: </span>
            {new Date(user?.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
          <p className="text-gray-300">
            <span className="font-bold">Last Login: </span>
            {formatDate(user?.lastLogin)}
          </p>
        </motion.div>
        <motion.div>
          <motion.button
            className="text-green-400 text-base"
            onClick={handleDeleteAccount}
          >
            {isDeleting ? <Loader className="w-6 h-6 animate-spin mx-auto"/> : "Delete Account"}
          </motion.button>
        </motion.div>     
      </div>

      <motion.div
        initial={{opacity:0, y:20}}
        animate={{opacity:1, y:0}}
        transition={{duration: 0.6}}
        className="mt-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleLogout}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold
          rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2
          focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto"/> : "Logout"}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default DashboardPage