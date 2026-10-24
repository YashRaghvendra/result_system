import { useState } from "react";
import api from "./api/axios";

function App() {
  // ================================
  // Student details
  // ================================
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");

  // ================================
  // Exactly 4 subjects
  // ================================
  const [subjects, setSubjects] = useState([
    {
      subjectCode: "",
      subjectName: "",
      mse: "",
      ese: "",
    },
    {
      subjectCode: "",
      subjectName: "",
      mse: "",
      ese: "",
    },
    {
      subjectCode: "",
      subjectName: "",
      mse: "",
      ese: "",
    },
    {
      subjectCode: "",
      subjectName: "",
      mse: "",
      ese: "",
    },
  ]);

  // ================================
  // State
  // ================================
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [savedResult, setSavedResult] = useState(null);

  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // ================================
  // Handle subject changes
  // ================================
  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];

    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: value,
    };

    setSubjects(updatedSubjects);
  };

  // ================================
  // Submit result
  // ================================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setSavedResult(null);

    // Student validation
    if (
      !studentId.trim() ||
      !studentName.trim() ||
      !program.trim() ||
      !semester
    ) {
      setMessage("Please fill in all student details.");
      setMessageType("error");
      return;
    }

    // Subject validation
    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];

      if (
        !subject.subjectCode.trim() ||
        !subject.subjectName.trim() ||
        subject.mse === "" ||
        subject.ese === ""
      ) {
        setMessage(
          `Please complete all fields for Subject ${i + 1}.`
        );
        setMessageType("error");
        return;
      }

      if (Number(subject.mse) < 0 || Number(subject.mse) > 40) {
        setMessage(
          `MSE for Subject ${i + 1} must be between 0 and 40.`
        );
        setMessageType("error");
        return;
      }

      if (Number(subject.ese) < 0 || Number(subject.ese) > 60) {
        setMessage(
          `ESE for Subject ${i + 1} must be between 0 and 60.`
        );
        setMessageType("error");
        return;
      }
    }

    // Data sent to Spring Boot
    const resultData = {
      studentId: studentId.trim(),
      studentName: studentName.trim(),
      program: program.trim(),
      semester: semester,

      subjects: subjects.map((subject) => ({
        subjectCode: subject.subjectCode.trim(),
        subjectName: subject.subjectName.trim(),
        mse: Number(subject.mse),
        ese: Number(subject.ese),
      })),
    };

    console.log("Sending result:", resultData);

    try {
      setLoading(true);

      const response = await api.post("/results", resultData);

      console.log("Backend response:", response.data);

      setSavedResult(response.data);

      setMessage("Result submitted successfully!");
      setMessageType("success");

    } catch (error) {
      console.error("Submit error:", error);

      if (error.response) {
        setMessage(
          error.response.data?.message ||
          `Server error: ${error.response.status}`
        );
      } else {
        setMessage(
          "Unable to connect to the Spring Boot backend."
        );
      }

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  // ================================
  // Search result
  // ================================
  const handleSearch = async (event) => {
    event.preventDefault();

    setMessage("");
    setSearchResult(null);

    if (!searchId.trim()) {
      setMessage("Please enter a Student ID.");
      setMessageType("error");
      return;
    }

    try {
      setSearchLoading(true);

      const response = await api.get(
        `/results/${searchId.trim()}`
      );

      console.log("Search response:", response.data);

      setSearchResult(response.data);

    } catch (error) {
      console.error("Search error:", error);

      if (error.response) {
        setMessage(
          error.response.data?.message ||
          `No result found for ${searchId}.`
        );
      } else {
        setMessage(
          "Unable to connect to the Spring Boot backend."
        );
      }

      setMessageType("error");

    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="app">

      {/* =====================================
          HEADER
      ====================================== */}
      <header className="header">

        <div className="header-content">

          <div className="logo">
            <div className="logo-circle">
              VIT
            </div>

            <div>
              <h1>VIT Result Management System</h1>
              <p>Student Semester Result Portal</p>
            </div>
          </div>

        </div>

      </header>


      {/* =====================================
          MAIN
      ====================================== */}
      <main className="main-container">

        {/* ===================================
            CREATE RESULT
        ==================================== */}
        <section className="card">

          <div className="card-heading">
            <div className="heading-icon">
              📝
            </div>

            <div>
              <h2>Enter Student Result</h2>
              <p>
                Enter student information and semester marks
              </p>
            </div>
          </div>


          <form onSubmit={handleSubmit}>

            {/* Student Details */}
            <div className="form-section">

              <div className="section-title">
                <span>01</span>
                Student Details
              </div>

              <div className="form-grid">

                <div className="form-group">
                  <label>
                    Student ID
                  </label>

                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) =>
                      setStudentId(e.target.value)
                    }
                    placeholder="22BCE1234"
                  />
                </div>


                <div className="form-group">
                  <label>
                    Student Name
                  </label>

                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) =>
                      setStudentName(e.target.value)
                    }
                    placeholder="Rahul Sharma"
                  />
                </div>


                <div className="form-group">
                  <label>
                    Program
                  </label>

                  <input
                    type="text"
                    value={program}
                    onChange={(e) =>
                      setProgram(e.target.value)
                    }
                    placeholder="B.Tech Computer Science"
                  />
                </div>


                <div className="form-group">
                  <label>
                    Semester
                  </label>

                  <select
                    value={semester}
                    onChange={(e) =>
                      setSemester(e.target.value)
                    }
                  >
                    <option value="">
                      Select Semester
                    </option>

                    <option value="Semester 1">
                      Semester 1
                    </option>

                    <option value="Semester 2">
                      Semester 2
                    </option>

                    <option value="Semester 3">
                      Semester 3
                    </option>

                    <option value="Semester 4">
                      Semester 4
                    </option>

                    <option value="Semester 5">
                      Semester 5
                    </option>

                    <option value="Semester 6">
                      Semester 6
                    </option>

                    <option value="Semester 7">
                      Semester 7
                    </option>

                    <option value="Semester 8">
                      Semester 8
                    </option>

                  </select>
                </div>

              </div>

            </div>


            {/* Subjects */}
            <div className="form-section">

              <div className="section-title">
                <span>02</span>
                Subject Marks
              </div>

              <p className="section-description">
                Enter MSE marks out of 40 and ESE marks out of 60.
              </p>


              <div className="subjects-container">

                {subjects.map((subject, index) => (

                  <div
                    className="subject-card"
                    key={index}
                  >

                    <div className="subject-number">
                      {index + 1}
                    </div>


                    <div className="subject-content">

                      <h3>
                        Subject {index + 1}
                      </h3>

                      <div className="subject-grid">

                        <div className="form-group">
                          <label>
                            Subject Code
                          </label>

                          <input
                            type="text"
                            value={subject.subjectCode}
                            onChange={(e) =>
                              handleSubjectChange(
                                index,
                                "subjectCode",
                                e.target.value
                              )
                            }
                            placeholder="BCSE101"
                          />
                        </div>


                        <div className="form-group subject-name">
                          <label>
                            Subject Name
                          </label>

                          <input
                            type="text"
                            value={subject.subjectName}
                            onChange={(e) =>
                              handleSubjectChange(
                                index,
                                "subjectName",
                                e.target.value
                              )
                            }
                            placeholder="Data Structures"
                          />
                        </div>


                        <div className="form-group">
                          <label>
                            MSE
                            <span className="limit">
                              / 40
                            </span>
                          </label>

                          <input
                            type="number"
                            min="0"
                            max="40"
                            value={subject.mse}
                            onChange={(e) =>
                              handleSubjectChange(
                                index,
                                "mse",
                                e.target.value
                              )
                            }
                            placeholder="25"
                          />
                        </div>


                        <div className="form-group">
                          <label>
                            ESE
                            <span className="limit">
                              / 60
                            </span>
                          </label>

                          <input
                            type="number"
                            min="0"
                            max="60"
                            value={subject.ese}
                            onChange={(e) =>
                              handleSubjectChange(
                                index,
                                "ese",
                                e.target.value
                              )
                            }
                            placeholder="60"
                          />
                        </div>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>


            {/* Submit */}
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Result
                  <span className="arrow">
                    →
                  </span>
                </>
              )}

            </button>

          </form>


          {/* Message */}
          {message && (
            <div
              className={`message ${
                messageType === "success"
                  ? "success"
                  : "error"
              }`}
            >
              <span>
                {messageType === "success"
                  ? "✓"
                  : "!"}
              </span>

              {message}
            </div>
          )}

        </section>


        {/* ===================================
            SAVED RESULT
        ==================================== */}
        {savedResult && (

          <section className="card result-card">

            <div className="success-header">

              <div className="success-icon">
                ✓
              </div>

              <div>
                <h2>Result Saved Successfully</h2>
                <p>
                  The result has been stored in the database.
                </p>
              </div>

            </div>


            <StudentInformation
              result={savedResult}
            />

            <ResultTable result={savedResult} />

          </section>

        )}


        {/* ===================================
            SEARCH RESULT
        ==================================== */}
        <section className="card">

          <div className="card-heading">

            <div className="heading-icon search-icon">
              🔍
            </div>

            <div>
              <h2>Search Student Result</h2>
              <p>
                Retrieve a student's semester result using their ID.
              </p>
            </div>

          </div>


          <form
            onSubmit={handleSearch}
            className="search-form"
          >

            <div className="search-input-wrapper">

              <span className="search-symbol">
                🔍
              </span>

              <input
                type="text"
                value={searchId}
                onChange={(e) =>
                  setSearchId(e.target.value)
                }
                placeholder="Enter Student ID"
              />

            </div>


            <button
              type="submit"
              className="search-button"
              disabled={searchLoading}
            >

              {searchLoading
                ? "Searching..."
                : "Search Result"}

            </button>

          </form>


          {searchResult && (

            <div className="search-result">

              <div className="result-found">
                <span>✓</span>
                Result Found
              </div>

              <StudentInformation
                result={searchResult}
              />

              <ResultTable
                result={searchResult}
              />

            </div>

          )}

        </section>

      </main>


      {/* =====================================
          FOOTER
      ====================================== */}
      <footer className="footer">
        <p>
          VIT Result Management System
        </p>

        <span>
          Student Semester Result Portal
        </span>
      </footer>


      {/* =====================================
          CSS
      ====================================== */}
      <style>{`

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;

          background: #f1f5f9;
          color: #172554;
        }

        .app {
          min-height: 100vh;
          background:
            linear-gradient(
              135deg,
              #eef5ff 0%,
              #f8fafc 45%,
              #eef4ff 100%
            );
        }


        /* ===============================
           HEADER
        =============================== */

        .header {
          background:
            linear-gradient(
              135deg,
              #0b2a6f,
              #174ea6
            );

          color: white;

          padding: 28px 20px;

          box-shadow:
            0 4px 18px rgba(15, 45, 100, 0.2);
        }

        .header-content {
          max-width: 1100px;
          margin: auto;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .logo-circle {
          width: 62px;
          height: 62px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: white;
          color: #123d8d;

          font-size: 20px;
          font-weight: 800;

          border: 4px solid #fbbf24;

          box-shadow:
            0 4px 12px rgba(0,0,0,0.2);
        }

        .header h1 {
          font-size: 27px;
          font-weight: 700;
          margin-bottom: 5px;
          letter-spacing: -0.3px;
        }

        .header p {
          color: #dbeafe;
          font-size: 15px;
        }


        /* ===============================
           MAIN
        =============================== */

        .main-container {
          max-width: 1100px;
          margin: 35px auto;
          padding: 0 20px;
        }

        .card {
          background: white;

          border-radius: 16px;

          padding: 30px;

          margin-bottom: 28px;

          border:
            1px solid #dbeafe;

          box-shadow:
            0 8px 30px rgba(30, 64, 175, 0.08);
        }


        /* ===============================
           CARD HEADING
        =============================== */

        .card-heading {
          display: flex;
          align-items: center;

          gap: 15px;

          margin-bottom: 30px;

          padding-bottom: 20px;

          border-bottom:
            1px solid #e2e8f0;
        }

        .heading-icon {
          width: 46px;
          height: 46px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background: #dbeafe;

          font-size: 22px;
        }

        .search-icon {
          background: #e0f2fe;
        }

        .card-heading h2 {
          font-size: 21px;
          color: #0f2f73;
          margin-bottom: 4px;
        }

        .card-heading p {
          color: #64748b;
          font-size: 14px;
        }


        /* ===============================
           FORM SECTION
        =============================== */

        .form-section {
          margin-bottom: 35px;
        }

        .section-title {
          display: flex;
          align-items: center;

          gap: 10px;

          font-size: 17px;
          font-weight: 700;

          color: #163d86;

          margin-bottom: 20px;
        }

        .section-title span {
          width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #1d4ed8;
          color: white;

          font-size: 12px;
        }

        .section-description {
          color: #64748b;
          font-size: 14px;
          margin-top: -10px;
          margin-bottom: 20px;
        }

        .form-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          color: #334155;
          font-size: 13px;
          font-weight: 700;

          margin-bottom: 8px;
        }

        .limit {
          color: #94a3b8;
          font-weight: 500;
          margin-left: 3px;
        }

        input,
        select {
          width: 100%;

          padding: 12px 14px;

          border:
            1px solid #cbd5e1;

          border-radius: 8px;

          background: #ffffff;

          color: #172554;

          font-size: 14px;

          outline: none;

          transition:
            border-color 0.2s,
            box-shadow 0.2s,
            background 0.2s;
        }

        input:hover,
        select:hover {
          border-color: #93c5fd;
        }

        input:focus,
        select:focus {
          border-color: #2563eb;

          box-shadow:
            0 0 0 3px rgba(37, 99, 235, 0.12);

          background: #fafdff;
        }

        input::placeholder {
          color: #94a3b8;
        }


        /* ===============================
           SUBJECTS
        =============================== */

        .subjects-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .subject-card {
          display: flex;

          background:
            linear-gradient(
              135deg,
              #f8fbff,
              #ffffff
            );

          border:
            1px solid #dbeafe;

          border-radius: 12px;

          overflow: hidden;

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .subject-card:hover {
          transform: translateY(-2px);

          box-shadow:
            0 6px 18px rgba(37, 99, 235, 0.1);
        }

        .subject-number {
          width: 55px;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            linear-gradient(
              180deg,
              #1d4ed8,
              #1e40af
            );

          color: white;

          font-size: 18px;
          font-weight: 700;
        }

        .subject-content {
          flex: 1;
          padding: 18px 20px;
        }

        .subject-content h3 {
          color: #1e3a8a;
          font-size: 15px;
          margin-bottom: 15px;
        }

        .subject-grid {
          display: grid;

          grid-template-columns:
            1fr 2fr 1fr 1fr;

          gap: 15px;
        }


        /* ===============================
           BUTTONS
        =============================== */

        .submit-button {
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 12px;

          padding: 14px 20px;

          border: none;
          border-radius: 9px;

          background:
            linear-gradient(
              135deg,
              #1d4ed8,
              #2563eb
            );

          color: white;

          font-size: 16px;
          font-weight: 700;

          cursor: pointer;

          box-shadow:
            0 5px 15px rgba(37, 99, 235, 0.25);

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow:
            0 8px 20px rgba(37, 99, 235, 0.32);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .arrow {
          font-size: 20px;
        }


        .search-button {
          padding: 12px 24px;

          border: none;
          border-radius: 8px;

          background: #0f766e;

          color: white;

          font-size: 14px;
          font-weight: 700;

          cursor: pointer;

          transition: 0.2s;
        }

        .search-button:hover:not(:disabled) {
          background: #115e59;
          transform: translateY(-1px);
        }

        .search-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }


        /* ===============================
           SPINNER
        =============================== */

        .spinner {
          width: 17px;
          height: 17px;

          border:
            2px solid rgba(255,255,255,0.4);

          border-top-color: white;

          border-radius: 50%;

          animation:
            spin 0.7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }


        /* ===============================
           MESSAGES
        =============================== */

        .message {
          display: flex;
          align-items: center;

          gap: 10px;

          margin-top: 20px;

          padding: 14px 16px;

          border-radius: 8px;

          font-size: 14px;
          font-weight: 600;
        }

        .message.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .message.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .message > span {
          width: 24px;
          height: 24px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: currentColor;

          color: white;

          font-size: 12px;
        }


        /* ===============================
           SUCCESS HEADER
        =============================== */

        .success-header {
          display: flex;
          align-items: center;

          gap: 15px;

          padding: 18px;

          margin-bottom: 25px;

          border-radius: 10px;

          background: #ecfdf5;

          border:
            1px solid #a7f3d0;
        }

        .success-icon {
          width: 45px;
          height: 45px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #10b981;

          color: white;

          font-size: 22px;
          font-weight: 700;
        }

        .success-header h2 {
          color: #065f46;
          font-size: 19px;
        }

        .success-header p {
          color: #047857;
          font-size: 13px;
          margin-top: 3px;
        }


        /* ===============================
           STUDENT INFORMATION
        =============================== */

        .student-info {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 12px;

          margin-bottom: 25px;
        }

        .info-box {
          padding: 15px;

          border-radius: 9px;

          background: #f8fafc;

          border:
            1px solid #e2e8f0;
        }

        .info-label {
          display: block;

          color: #64748b;

          font-size: 11px;

          text-transform: uppercase;

          letter-spacing: 0.5px;

          margin-bottom: 6px;
        }

        .info-value {
          color: #172554;

          font-size: 14px;

          font-weight: 700;
        }


        /* ===============================
           TABLE
        =============================== */

        .table-container {
          overflow-x: auto;

          border-radius: 10px;

          border:
            1px solid #dbeafe;
        }

        .result-table {
          width: 100%;

          border-collapse: collapse;

          min-width: 700px;
        }

        .result-table th {
          background:
            linear-gradient(
              135deg,
              #123d8d,
              #1d4ed8
            );

          color: white;

          padding: 13px 12px;

          text-align: left;

          font-size: 12px;

          text-transform: uppercase;

          letter-spacing: 0.3px;
        }

        .result-table td {
          padding: 13px 12px;

          border-bottom:
            1px solid #e2e8f0;

          color: #334155;

          font-size: 13px;
        }

        .result-table tbody tr:nth-child(even) {
          background: #f8fafc;
        }

        .result-table tbody tr:hover {
          background: #eff6ff;
        }

        .grade {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          min-width: 38px;

          padding: 5px 8px;

          border-radius: 5px;

          background: #dbeafe;

          color: #1d4ed8;

          font-weight: 800;

          font-size: 12px;
        }


        /* ===============================
           OVERALL RESULT
        =============================== */

        .overall {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 12px;

          margin-top: 20px;
        }

        .overall-box {
          padding: 18px;

          border-radius: 10px;

          text-align: center;

          background: #f8fafc;

          border:
            1px solid #e2e8f0;
        }

        .overall-box strong {
          display: block;

          color: #64748b;

          font-size: 12px;

          margin-bottom: 7px;

          text-transform: uppercase;
        }

        .overall-box span {
          color: #172554;

          font-size: 20px;

          font-weight: 800;
        }

        .pass {
          color: #059669 !important;
        }

        .fail {
          color: #dc2626 !important;
        }


        /* ===============================
           SEARCH
        =============================== */

        .search-form {
          display: flex;

          gap: 12px;

          margin-bottom: 25px;
        }

        .search-input-wrapper {
          position: relative;

          flex: 1;
        }

        .search-input-wrapper input {
          padding-left: 42px;
        }

        .search-symbol {
          position: absolute;

          left: 14px;
          top: 50%;

          transform:
            translateY(-50%);

          font-size: 16px;

          z-index: 2;
        }

        .result-found {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          margin-bottom: 18px;

          padding: 7px 12px;

          border-radius: 20px;

          background: #ecfdf5;

          color: #047857;

          font-size: 12px;

          font-weight: 700;
        }

        .result-found span {
          font-size: 14px;
        }


        /* ===============================
           FOOTER
        =============================== */

        .footer {
          text-align: center;

          padding: 25px 20px;

          color: #64748b;

          font-size: 13px;
        }

        .footer span {
          display: block;

          margin-top: 4px;

          color: #94a3b8;

          font-size: 12px;
        }


        /* ===============================
           RESPONSIVE
        =============================== */

        @media (max-width: 850px) {

          .subject-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .student-info {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .overall {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }


        @media (max-width: 600px) {

          .header {
            padding: 22px 15px;
          }

          .logo-circle {
            width: 50px;
            height: 50px;

            font-size: 16px;
          }

          .header h1 {
            font-size: 20px;
          }

          .header p {
            font-size: 12px;
          }

          .main-container {
            margin-top: 20px;
            padding: 0 12px;
          }

          .card {
            padding: 20px 15px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .subject-grid {
            grid-template-columns: 1fr;
          }

          .student-info {
            grid-template-columns: 1fr;
          }

          .overall {
            grid-template-columns: 1fr;
          }

          .search-form {
            flex-direction: column;
          }

          .search-button {
            width: 100%;
          }

          .subject-number {
            width: 42px;
          }

          .subject-content {
            padding: 15px;
          }

        }

      `}</style>

    </div>
  );
}


/* =========================================
   STUDENT INFORMATION
========================================= */

function StudentInformation({ result }) {

  return (
    <div className="student-info">

      <div className="info-box">
        <span className="info-label">
          Student ID
        </span>

        <span className="info-value">
          {result.studentId}
        </span>
      </div>


      <div className="info-box">
        <span className="info-label">
          Student Name
        </span>

        <span className="info-value">
          {result.studentName}
        </span>
      </div>


      <div className="info-box">
        <span className="info-label">
          Program
        </span>

        <span className="info-value">
          {result.program}
        </span>
      </div>


      <div className="info-box">
        <span className="info-label">
          Semester
        </span>

        <span className="info-value">
          {result.semester}
        </span>
      </div>

    </div>
  );
}


/* =========================================
   RESULT TABLE
========================================= */

function ResultTable({ result }) {

  if (!result || !result.subjects) {
    return null;
  }

  return (
    <div>

      <div className="table-container">

        <table className="result-table">

          <thead>

            <tr>
              <th>Code</th>
              <th>Subject</th>
              <th>MSE</th>
              <th>ESE</th>
              <th>Total</th>
              <th>Grade</th>
              <th>GP</th>
            </tr>

          </thead>


          <tbody>

            {result.subjects.map(
              (subject, index) => (

                <tr key={index}>

                  <td>
                    <strong>
                      {subject.subjectCode}
                    </strong>
                  </td>

                  <td>
                    {subject.subjectName}
                  </td>

                  <td>
                    {subject.mse}
                  </td>

                  <td>
                    {subject.ese}
                  </td>

                  <td>
                    <strong>
                      {subject.total}
                    </strong>
                  </td>

                  <td>
                    <span className="grade">
                      {subject.grade}
                    </span>
                  </td>

                  <td>
                    {subject.gradePoint}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>


      {/* Overall result */}

      <div className="overall">

        <div className="overall-box">
          <strong>
            Total Marks
          </strong>

          <span>
            {result.totalMarks}
          </span>
        </div>


        <div className="overall-box">
          <strong>
            Percentage
          </strong>

          <span>
            {result.percentage}%
          </span>
        </div>


        <div className="overall-box">
          <strong>
            SGPA
          </strong>

          <span>
            {result.sgpa}
          </span>
        </div>


        <div className="overall-box">
          <strong>
            Result
          </strong>

          <span
            className={
              result.result === "PASS"
                ? "pass"
                : "fail"
            }
          >
            {result.result}
          </span>
        </div>

      </div>

    </div>
  );
}


export default App;

