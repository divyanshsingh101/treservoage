import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Leaderboard() {
  const { id } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [quizTitle, setQuizTitle] = useState("Loading...");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`http://localhost:3000/leaderboard/${id}`, {
          method: "GET",
          credentials: "include", // ✅ Needed for Passport sessions
        });

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }

        const data = await response.json();
        console.log(data);

        // ✅ Filter only participants who have attempted the quiz
        const attemptedParticipants = data.hunt.participants.filter(participant => participant.hasAttempted);

        setLeaderboard(attemptedParticipants);
        setQuizTitle(data.hunt.name || "Leaderboard"); // ✅ Use hunt name for title
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Leaderboard: {quizTitle}</h1>
      <div className="bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">Rank</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Score</th>
              <th className="px-6 py-3 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <tr key={index} className="border-t">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{entry.user?.name || "Unknown"}</td> {/* ✅ Name from User model */}
                  <td className="px-6 py-4">{entry.user?.email || "No Email"}</td> {/* ✅ Email from User model */}
                  <td className="px-6 py-4">{entry.points}</td>
                  <td className="px-6 py-4">
                    {new Date(entry._id.toString().substring(0, 8) * 1000).toLocaleString()}
                  </td> {/* Using `_id` timestamp if no explicit `timestamp` field */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No participants have attempted the quiz yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
