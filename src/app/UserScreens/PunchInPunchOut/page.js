"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/Context/AuthContext";
import { punchIn, punchOut,getRecordPunchin } from "@/Service/punchService";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  FaUser, 
  FaClock, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaSignInAlt, 
  FaSignOutAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaMapPin
} from "react-icons/fa";

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3B82F6" width="40" height="40">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

export default function PunchInPunchOut() {
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [todayPunch, setTodayPunch] = useState(null);
  const [isPunchedIn, setIsPunchedIn] = useState(false);

  const todayDate = new Date().toISOString().split("T")[0];

  // ⏰ Live Time
  useEffect(() => {
    const i = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      );
    }, 1000);
    return () => clearInterval(i);
  }, []);

  // 📍 Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation({ lat: 40.7128, lng: -74.0060 }) // fallback
      );
    }
  }, []);

  // 🗓 Fetch today's punch record
  useEffect(() => {
    const fetchTodayPunch = async () => {
      if (!user?.id) return;
      try {
        const res = await getRecordPunchin(user.id, todayDate);
        const data = await res.json();
        if (data.punches?.length > 0) {
          const punch = data.punches[0];
          setTodayPunch(punch);
          setIsPunchedIn(punch.PunchIntime && !punch.PunchOuttime);
        }
      } catch (err) {
        console.error("Failed to fetch punch record:", err);
      }
    };

    fetchTodayPunch();
  }, [user, todayDate]);

  // ✅ Punch In
  const handlePunchIn = async () => {
    if (!location) {
      setMessage("📍 Please enable location services");
      return;
    }
    setLoading(true);
    try {
      await punchIn({
        userId: user.id,
        date: todayDate,
        PunchIntime: new Date().toISOString(),
        latitude: location.lat,
        longitude: location.lng,
      });
      setMessage("✅ Punch In Successful");
      setIsPunchedIn(true);
      setTodayPunch({ ...todayPunch, PunchIntime: new Date().toISOString() });
    } catch {
      setMessage("❌ Punch In Failed");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // ✅ Punch Out
  const handlePunchOut = async () => {
    setLoading(true);
    try {
      await punchOut({
        userId: user.id,
        date: todayDate,
        PunchOuttime: new Date().toISOString(),
      });
      setMessage("✅ Punch Out Successful");
      setIsPunchedIn(false);
      setTodayPunch({ ...todayPunch, PunchOuttime: new Date().toISOString() });
    } catch {
      setMessage("❌ Punch Out Failed");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const todayDisplay = new Date().toLocaleDateString("en-GB", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FaUser className="text-blue-200" size={18} />
              <h2 className="text-xl font-bold">Welcome back!</h2>
            </div>
            <p className="text-blue-100 font-semibold">{user?.username || "Employee"}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <FaClock size={24} className="text-white" />
          </div>
        </div>

        {/* Date & Time */}
        <div className="p-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-6 border border-blue-100">
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FaCalendarAlt className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Today is</p>
                  <p className="font-semibold text-gray-800">{todayDisplay}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <FaClock className="text-indigo-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Time</p>
                  <p className="text-2xl font-bold text-gray-800 font-mono">{time}</p>
                </div>
              </div>
              <div className="h-12 w-1 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-full"></div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" size={18} />
                <h3 className="font-semibold text-gray-700">Your Location</h3>
              </div>
              {location ? (
                <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <FaCheckCircle size={14} /> Detected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                  <FaSpinner className="animate-spin" size={14} /> Detecting...
                </span>
              )}
            </div>
            {location && (
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <MapContainer center={location} zoom={16} style={{ height: "200px", width: "100%" }} zoomControl={false} scrollWheelZoom={false}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={location} icon={customIcon}></Marker>
                </MapContainer>
                <div className="bg-gray-50 p-3 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-600">
                  <FaMapPin className="text-blue-500" /> Lat: {location.lat.toFixed(6)} | Lng: {location.lng.toFixed(6)}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handlePunchIn}
              disabled={loading || !location || todayPunch?.PunchIntime}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${loading || !location || todayPunch?.PunchIntime ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg"}`}
            >
              {loading && !todayPunch?.PunchIntime ? <FaSpinner className="animate-spin" /> : <FaSignInAlt size={22} />}
              {!loading && !todayPunch?.PunchIntime && "Punch In"}
              {todayPunch?.PunchIntime && "Already Punched In"}
            </button>

            <button
              onClick={handlePunchOut}
              disabled={loading || !todayPunch?.PunchIntime || todayPunch?.PunchOuttime}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${loading || !todayPunch?.PunchIntime || todayPunch?.PunchOuttime ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg"}`}
            >
              {loading && todayPunch?.PunchIntime && !todayPunch?.PunchOuttime ? <FaSpinner className="animate-spin" /> : <FaSignOutAlt size={22} />}
              {!loading && todayPunch?.PunchIntime && !todayPunch?.PunchOuttime && "Punch Out"}
              {todayPunch?.PunchOuttime && "Already Punched Out"}
            </button>
          </div>

          {/* Status Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 animate-fadeIn ${message.includes("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {message.includes("✅") ? <FaCheckCircle size={20} className="text-green-500" /> : <FaExclamationCircle size={20} className="text-red-500" />}
              <span className="font-medium">{message.replace(/[✅❌]/g, '').trim()}</span>
            </div>
          )}

          {/* Status Indicator */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full animate-pulse ${isPunchedIn ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-600">Status: {isPunchedIn ? "Currently Punched In" : "Not Punched In"}</span>
            </div>
            <span className={`text-sm font-semibold ${isPunchedIn ? 'text-green-600' : 'text-gray-400'}`}>{isPunchedIn ? "ACTIVE" : "INACTIVE"}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
