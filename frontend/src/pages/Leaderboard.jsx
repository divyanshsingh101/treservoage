import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Medal } from "lucide-react";

function Leaderboard() {
  const { id } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [quizTitle, setQuizTitle] = useState("Loading...");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`http://localhost:3000/leaderboard/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }

        const data = await response.json();
        const attemptedParticipants = data.hunt.participants.filter(
          (participant) => participant.hasAttempted
        );
        setLeaderboard(attemptedParticipants);
        setQuizTitle(data.hunt.name || "Leaderboard");
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">🏆 {quizTitle} Leaderboard</h1>
      <table className="min-w-full table-auto text-gray-700">
        <thead className="bg-[#f5f5f5] text-gray-900">
          <tr>
            <th className="px-6 py-3 text-left">Rank</th>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Score</th>
            <th className="px-6 py-3 text-left">Time</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, index) => (
              <tr
                key={index}
                className={`border-t ${index % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}`}
              >
                <td className="px-6 py-4 flex items-center font-medium">
                  {index < 3 && <Medal className="w-4 h-4 text-yellow-500 mr-2" />}
                  {index + 1}
                </td>
                <td className="px-6 py-4 font-semibold">{entry.user?.name || "Unknown"}</td>
                <td className="px-6 py-4 font-bold text-gray-800">{entry.points}</td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(parseInt(entry._id.toString().substring(0, 8), 16) * 1000).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                No participants have attempted the quiz yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
