import React, { useEffect, useState } from "react";
import newRequest from "../../utils/newRequest";

function Logs() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getLogs = async (page = 1) => {
    try {
      const response = await newRequest.get(`/logs/listLogs?page=${page}`);
      setLogs(response.data.data);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(Math.ceil(response.data.pagination.pageSize));
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  useEffect(() => {
    getLogs(currentPage);
  }, [currentPage]);

  // Log card component
  const LogCard = ({ log }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div className="border border-gray-300 rounded-lg shadow-md p-4 mb-6 bg-white">
        {/* Log header */}
        <div className="flex justify-between items-center">
          <div className="w-full">
            <h3 className="font-bold text-lg text-primary">{log.message}</h3>
            <p className="text-sm text-gray-500 break-words">
              <strong>ID:</strong> {log._id}
            </p>
          </div>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded ${
              log.level === "info"
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {log.level.toUpperCase()}
          </span>
        </div>

        {/* Timestamp */}
        <p className="text-sm text-gray-600 mt-2">
          <strong>Timestamp:</strong>{" "}
          {new Date(log.timestamp).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>

        {/* Expand details button */}
        <button
          className="text-sm text-primary mt-3 underline"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Hide Details" : "Show Details"}
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-4 border-t pt-4 max-h-80 overflow-y-auto bg-gray-50 rounded-lg p-3">
            <h4 className="font-semibold text-gray-700 mb-3">Metadata:</h4>
            <DynamicRender data={log.metadata} />
          </div>
        )}
      </div>
    );
  };

  // Dynamic rendering of metadata with horizontal scroll for long strings
  const DynamicRender = ({ data }) => {
    if (typeof data === "object" && data !== null) {
      return (
        <div className="ml-4 border-l pl-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="mt-2">
              <p className="font-semibold text-gray-800">{key}:</p>
              {typeof value === "object" && value !== null ? (
                <DynamicRender data={value} />
              ) : (
                <div className="text-gray-700 overflow-x-auto whitespace-nowrap">
                  <span>{String(value)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-gray-700 overflow-x-auto whitespace-nowrap">
        <span>{String(data)}</span>
      </div>
    );
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-primary mb-6">Application Logs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {logs && logs.length > 0 ? (
          logs.map((log, index) => <LogCard key={log._id || index} log={log} />)
        ) : (
          <div className="text-center text-gray-500">No logs available.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          className="px-4 py-2 bg-gray-300 rounded-md mx-2 text-sm font-medium"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 rounded-md mx-2 text-sm font-medium"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Logs;
