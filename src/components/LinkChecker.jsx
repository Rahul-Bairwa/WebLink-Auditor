import React, { useState } from "react";
import ErrorModal from "./ErrorModal";
import { FcSearch } from "react-icons/fc";
import { PiLinkBreak } from "react-icons/pi";
import { VscCheckAll } from "react-icons/vsc";
import { BsFiletypeCsv, BsGlobe2 } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
const LinkChecker = () => {
  const [url, setUrl] = useState("");
  const [processedPages, setProcessedPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [brokenLinks, setBrokenLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const calculateProgress = () => {
    if (totalPages === 0) return 0;
    return Math.min((processedPages / totalPages) * 100, 100);
  };

  const checkLinks = (e) => {
    setBrokenLinks([]);
    e.preventDefault();
    setLoading(true);
    setProcessedPages(0); // Reset counts
    setTotalPages(0);

    const eventSource = new EventSource(
      `http://localhost:5200/check-links-stream?url=${encodeURIComponent(url)}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.status === "init") {
        // Set total pages when the backend sends the total count
        setTotalPages(data.totalPages);
      } else if (data.status === "checked") {
        // Increment processed page count
        setProcessedPages((prev) => prev + 1);
      } else if (data.status === "completed") {
        setLoading(false);
        setBrokenLinks(data.brokenLinks);
        eventSource.close();
      } else if (data.status === "error") {
        setErrorMessage(data.message);
        setShowErrorModal(true);
        setLoading(false);
        eventSource.close();
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      setLoading(false);
      eventSource.close();
    };
  };

  const exportToCSV = () => {
    const headers = ["#", "Broken Link", "Link Text", "Page Found", "Status"];
    const rows = brokenLinks.map((brokenLink, index) => [
      index + 1,
      brokenLink.link,
      brokenLink.linkText || "N/A",
      brokenLink.pageUrl,
      brokenLink.statusCode,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((value) => `"${value}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "broken_links.csv";
    link.click();
  };
  console.log("totalPages", totalPages)
  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center sm:px-10 sm:py-10 px-0 py-0 ">
      <ErrorModal show={showErrorModal} message={errorMessage} onClose={() => setShowErrorModal(false)} />
      <div className="w-full max-w-6xl bg-slate-50  sm:rounded-lg sm:px-6 py-12 px-6 " style={{ backgroundColor: "#F5FAFD",  border: "1px solid rgb(196 196 196 / 50%)"}}>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-black">WebLink Auditor</h1>
          <p className="text-lg text-black-200 mt-2">
            Simplifying Broken Link Analysis for Better SEO and Web Integrity
          </p>
        </div>
        <form
          onSubmit={checkLinks}
          className="flex flex-col md:flex-row gap-4 items-center w-full mb-6"
        >
          <input
            type="text"
            placeholder="Enter website URL"
            value={url}
            onChange={handleUrlChange}
            className="w-full 2xl:w-4/5 md:w-3/5 sm:w-3/5 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
          />
          <button
            disabled={loading}
            className={`w-full px-6 py-3 2xl:w-1/5 md:w-2/5 font-semibold rounded-lg text-white ${loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {loading ? "Checking..." : "Check Links"}
          </button>
        </form>
        {totalPages > 0 ?
          <div className="mb-6">
            <h2 className="text-lg font-bold text-black mb-2">Status:</h2>
            <div className="w-full bg-gray-300 rounded-full h-6">
              <div
                className="bg-lime-500 h-6 rounded-full text-center text-white font-bold"
                style={{
                  width: `${calculateProgress()}%`,
                  lineHeight: "1.5rem",
                }}
              >
                {`${Math.round(calculateProgress())}%`}
              </div>
            </div>
            <p className="text-black-300 mt-2">
              Processed {processedPages} out of {totalPages} web pages
            </p>
          </div> : <><div className="mb-8">
            <p className="text-black text-center">
            WebLink Auditor ek powerful tool hai jo aapke website ke SEO aur web integrity ko maintain karne me madad karta hai. Yeh tool aapke website ke saare internal aur external links scan karta hai, problematic links detect karta hai, aur detailed reports generate karta hai taaki aap unhe efficiently fix kar sakein. Chahe aap ek blog, e-commerce platform, ya corporate site manage kar rahe ho, WebLink Auditor aapke website ke structure ko optimize karne aur user experience ko behtar banane me sahayak hai.
            </p>
          </div>

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Feature 1 */}
                <div className="flex items-start space-x-4">
                  <div className="bg-black text-black p-3 rounded-full">
                    <span className="text-2xl text-white"><PiLinkBreak /></span>
                  </div>
                  <p className="text-black text-start">
                    Scans both internal and external links across unlimited pages.*
                  </p>
                </div>
                {/* Feature 2 */}
                <div className="flex items-start  space-x-4">
                  <div className="bg-black text-black p-3 rounded-full ">
                    <span className="text-2xl text-white"><IoIosSearch /></span>
                  </div>
                  <p className="text-black text-start">
                    Detects broken links, stale links, and “link rot” effectively.
                  </p>
                </div>
                {/* Feature 3 */}
                <div className="flex items-start space-x-4">
                  <div className="bg-black text-black p-3 rounded-full">
                    <span className="text-2xl text-white"><VscCheckAll /></span>
                  </div>
                  <p className="text-black text-start">
                    Reports HTTP errors (e.g., 404) for each problematic hyperlink.
                  </p>
                </div>
                {/* Feature 4 */}
                <div className="flex items-start space-x-4">
                  <div className="bg-black text-black p-3 rounded-full">
                    <span className="text-2xl text-white" text-blue-600><BsGlobe2 /></span>
                  </div>
                  <p className="text-black text-start">
                    Works seamlessly on all platforms – Windows, Mac, Linux, iOS,
                    and Android.
                  </p>
                </div>
                {/* Feature 5 */}
                <div className="flex items-start space-x-4">
                  <div className="bg-black text-black p-3 rounded-full">
                    <span className="text-2xl text-white"><BsFiletypeCsv /></span>
                  </div>
                  <p className="text-black text-start">
                    Provides detailed reports with exact locations in your HTML, and allows you to export the data as a CSV file.
                  </p>
                </div>
              </div>
            </div></>}

        {/* Broken Links */}
        {brokenLinks.length > 0 && (
          <div>
            <div className="flex justify-end mb-4 items-center">
              <h2 className="text-lg font-semibold text-black mr-2">Broken Links:</h2>
              <button onClick={exportToCSV} className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg flex items-center">Export to CSV <BsFiletypeCsv style={{marginLeft:"5px",fontSize:"20px0",fontWeight:700}}/></button>
            </div>
            <div className="overflow-x-auto">
              <table className="table-auto min-w-full text-sm text-left text-black-300 border-collapse" style={{border: "1px solid rgb(196 196 196 / 40%);",borderRadius:"5px"}}>
                <thead className="text-xs uppercase bg-white text-black-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">#</th>
                    <th scope="col" className="px-6 py-3">Broken Link</th>
                    <th scope="col" className="px-6 py-3">Link Text</th>
                    <th scope="col" className="px-6 py-3">Page Found</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {brokenLinks.map((brokenLink, index) => (
                    <tr
                      key={index}
                      className={`${index % 1 === 0 ? "bg-white" : "bg-gray-100"
                        } hover:bg-gray-100`}
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">
                        <a
                          href={brokenLink.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {brokenLink.link}
                        </a>
                      </td>
                      <td className="px-6 py-4">{brokenLink.linkText || "N/A"}</td>
                      <td className="px-6 py-4">
                        <a
                          href={brokenLink.pageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          Page
                        </a>
                      </td>
                      <td
                        className={`px-6 py-4 font-medium ${brokenLink.success ? "text-green-400" : "text-red-400"
                          }`}
                      >
                        {brokenLink.statusCode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default LinkChecker;
