import React from "react";
import GroqTest from "../components/GroqTest.jsx";

export default function Dashboard(){
    return (
        <div className="min-h-screen pt-20 pb-8"> {/* Added padding top to push content below header */}
            <div className="max-w-6xl mx-auto px-4"> {/* Increased max width and added horizontal padding */}
                <div className="bg-white shadow-lg p-8 rounded-xl"> {/* Increased padding and shadow */}
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2> {/* Larger heading */}
                    <GroqTest />
                </div>
            </div>
        </div>
    )
}