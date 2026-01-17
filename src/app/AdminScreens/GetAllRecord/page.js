"use client";

import { useState } from "react";
import { 
  FaSpinner, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaFilter,
  FaDownload,
  FaUser,
  FaClock,
  FaCalendarDay,
  FaLocationArrow,
  FaSearch,
  FaTimes
} from "react-icons/fa";
import { getPunchReport } from "@/Service/punchService";
import Link from "next/link";

export default function GetAllRecord() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRecords = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getPunchReport(startDate, endDate);
      setRecords(data.punches || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch records.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting records...");
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setRecords([]);
    setError("");
  };

  const filteredRecords = records.filter(rec => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (rec.userId?.username?.toLowerCase() || "").includes(searchLower) ||
      (rec.userId?._id?.toLowerCase() || "").includes(searchLower) ||
      rec.date.includes(searchLower) ||
      (rec.PunchIntime || "").toLowerCase().includes(searchLower) ||
      (rec.PunchOuttime || "").toLowerCase().includes(searchLower)
    );
  });

  const totalHours = filteredRecords.reduce((acc, rec) => {
    if (rec.PunchIntime && rec.PunchOuttime) {
      const punchIn = new Date(rec.PunchIntime);
      const punchOut = new Date(rec.PunchOuttime);
      const diffHours = (punchOut - punchIn) / (1000 * 60 * 60);
      return acc + diffHours;
    }
    return acc;
  }, 0);

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Attendance Records</h1>
        <p className="text-gray-600">View and manage employee punch-in/out records</p>
      </div>
      <div>
        <Link href="/AdminScreens/RegisterUser" className="text-blue-600 hover:underline mb-4 inline-block">
<button
        className="flex-1 bg-gradient-to-r mb-4 from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >Add New User</button>
                </Link>
      </div>  

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Records</p>
              <p className="text-2xl font-bold text-gray-800">{filteredRecords.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaCalendarDay className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Hours</p>
              <p className="text-2xl font-bold text-gray-800">{totalHours.toFixed(1)}h</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FaClock className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Employees</p>
              <p className="text-2xl font-bold text-gray-800">
                {new Set(filteredRecords.map(r => r.userId?._id)).size}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaUser className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Locations Tracked</p>
              <p className="text-2xl font-bold text-gray-800">
                {filteredRecords.filter(r => r.latitude && r.longitude).length}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <FaMapMarkerAlt className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <FaFilter className="text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Filter Records</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2" />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaSearch className="inline mr-2" />
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, date, time..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={fetchRecords}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <FaFilter />
                  Apply Filters
                </>
              )}
            </button>

            <button
              onClick={clearFilters}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
              title="Clear all filters"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <FaTimes className="text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Records Section */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Records</h2>
            <p className="text-sm text-gray-600">
              Showing {filteredRecords.length} of {records.length} records
            </p>
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg flex items-center gap-2 hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
          >
            <FaDownload />
            Export CSV
          </button>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <FaUser className="inline mr-2" />
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <FaCalendarDay className="inline mr-2" />
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <FaClock className="inline mr-2" />
                    Punch In
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <FaClock className="inline mr-2" />
                    Punch Out
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <FaClock className="inline mr-2" />
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRecords.map((rec, index) => {
                  const duration = rec.PunchIntime && rec.PunchOuttime 
                    ? ((new Date(rec.PunchOuttime) - new Date(rec.PunchIntime)) / (1000 * 60 * 60)).toFixed(1)
                    : null;

                  return (
                    <tr 
                      key={rec._id} 
                      className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {rec.userId?.username || "Unknown User"}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {rec.userId?._id?.substring(0, 8) || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {rec.date}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-700">{rec.PunchIntime || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="font-medium text-gray-700">{rec.PunchOuttime || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {rec.latitude && rec.longitude ? (
                          <a
                            href={`https://maps.google.com/?q=${rec.latitude},${rec.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <FaMapMarkerAlt />
                            <span className="text-sm">
                              {rec.latitude.toFixed(4)}, {rec.longitude.toFixed(4)}
                            </span>
                          </a>
                        ) : (
                          <span className="text-gray-400">No location</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {duration ? (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            parseFloat(duration) >= 8 
                              ? 'bg-green-100 text-green-800'
                              : parseFloat(duration) >= 6
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {duration}h
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <FaSearch className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {records.length === 0 ? "No Records Found" : "No Matching Records"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {records.length === 0 
                ? "Select date range and click 'Apply Filters' to view attendance records."
                : "Try adjusting your search or filters to find what you're looking for."
              }
            </p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {filteredRecords.length > 0 && (
        <div className="mt-6 text-sm text-gray-600 text-center">
          <p>
            Data fetched from {startDate} to {endDate} • 
            Total hours worked: <span className="font-semibold">{totalHours.toFixed(1)} hours</span> • 
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}