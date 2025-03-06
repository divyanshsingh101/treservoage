import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Import Auth Context
import { ClockIcon, UserGroupIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

function QuizCard({ quiz,hasAttempted ,upQuiz}) {
   const { user } = useAuth(); // ✅ Get user from AuthContext
   //console.log(user._id);
  const isRegistered = quiz.participants?.some((participant) => participant.user === user?._id);
  console.log("isRegistered");
  console.log(isRegistered)
  const handleRegister = async () => {
    try {
      console.log("quiz ud  dfg")
      console.log(quiz._id)
      const response = await fetch(`http://localhost:3000/participant/participate/${quiz._id}`, {
        method: "POST",
        credentials: "include", // ✅ Required for Passport sessions
        headers: { "Content-Type": "application/json" }
        
      });

      if (!response.ok) {
        throw new Error("Failed to register for the quiz.");
      }

      alert("Successfully registered!");
      window.location.reload(); // Refresh to update the button
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <AcademicCapIcon className="h-8 w-8 text-blue-500" />
          <h2 className="text-xl font-bold ml-2 text-gray-800">{quiz.title}</h2>
        </div>
        <p className="text-gray-600 mb-6 line-clamp-2">{quiz.description}</p>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="h-5 w-5 mr-1" />
            <span>{quiz.duration || "30"} mins</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <UserGroupIcon className="h-5 w-5 mr-1" />
            <span>{quiz.participants?.length || "0"} participants</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Link
            to={`/leaderboard/${quiz._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Leaderboard
          </Link>
          {isRegistered ? (
            // <Link
            //   to={`/QuizDisplay/${quiz._id}`}
            //   className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
            // >
            //   Start Quiz
            // </Link>
            !hasAttempted ? (
              <Link
                to={`/QuizDisplay/${quiz._id}`}
                className="mt-4 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Start Quiz
              </Link>
            ) : (
              <p className="text-blue-600 hover:text-blue-800 text-sm font-medium"></p>
            )
          ) : (
            <button
              onClick={handleRegister}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizCard;
