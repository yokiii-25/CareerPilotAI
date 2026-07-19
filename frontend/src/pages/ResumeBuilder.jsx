import { useState, useRef } from "react";
import api from "../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function ResumeBuilder() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    skills: "",
    education: "",
    projects: "",
  });

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const resumeRef = useRef();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const generateResume = async () => {
    try {
      setLoading(true);

      const response = await api.post("/generate-resume", form);

      setResume(response.data);
    } catch (err) {
      console.error(err);
      alert("Unable to generate resume.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const element = resumeRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pdfHeight =
      (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    pdf.save(`${form.name || "Resume"}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">

      <h1 className="text-4xl font-bold mb-8">
        📝 AI Resume Builder
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">

        {/* LEFT */}

        <div className="bg-white shadow-lg rounded-xl p-6">

          <h2 className="text-2xl font-semibold mb-5">
            Resume Details
          </h2>

          <input
            className="w-full border rounded p-3 mb-4"
            placeholder="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            className="w-full border rounded p-3 mb-4"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            className="w-full border rounded p-3 mb-4"
            placeholder="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <textarea
            rows={3}
            className="w-full border rounded p-3 mb-4"
            placeholder="Professional Summary"
            name="summary"
            value={form.summary}
            onChange={handleChange}
          />

          <textarea
            rows={3}
            className="w-full border rounded p-3 mb-4"
            placeholder="Skills (comma separated)"
            name="skills"
            value={form.skills}
            onChange={handleChange}
          />

          <textarea
            rows={2}
            className="w-full border rounded p-3 mb-4"
            placeholder="Education"
            name="education"
            value={form.education}
            onChange={handleChange}
          />

          <textarea
            rows={3}
            className="w-full border rounded p-3 mb-5"
            placeholder="Projects"
            name="projects"
            value={form.projects}
            onChange={handleChange}
          />

          <button
            onClick={generateResume}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition"
          >
            {loading ? "Generating..." : "Generate Resume"}
          </button>

        </div>

        {/* RIGHT */}

        <div className="bg-white shadow-lg rounded-xl p-8">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-2xl font-bold">
              Resume Preview
            </h2>

            {resume && (
              <button
                onClick={downloadPDF}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
              >
                📄 Download PDF
              </button>
            )}

          </div>

          {!resume ? (

            <p className="text-gray-500">
              Generate a resume to preview it here.
            </p>

          ) : (

            <div
              ref={resumeRef}
              className="bg-white p-8 border rounded-lg"
            >

              <h1 className="text-3xl font-bold">
                {form.name}
              </h1>

              <p>{form.email}</p>

              <p>{form.phone}</p>

              <hr className="my-5" />

              <h2 className="text-xl font-bold mb-2">
                Professional Summary
              </h2>

              <p className="mb-5">
                {resume.summary}
              </p>

              <h2 className="text-xl font-bold mb-2">
                Skills
              </h2>

              <ul className="list-disc ml-6 mb-5">

                {resume.skills?.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}

              </ul>

              <h2 className="text-xl font-bold mb-2">
                Education
              </h2>

              <p className="mb-5">
                {resume.education}
              </p>

              <h2 className="text-xl font-bold mb-2">
                Projects
              </h2>

              {resume.projects?.map((project, index) => (

                <div
                  key={index}
                  className="mb-5"
                >

                  <h3 className="font-semibold text-lg">
                    {project.name}
                  </h3>

                  <p>
                    {project.description}
                  </p>

                </div>

              ))}

              {resume.experience?.length > 0 && (
                <>
                  <h2 className="text-xl font-bold mb-2">
                    Experience
                  </h2>

                  <ul className="list-disc ml-6">
                    {resume.experience.map((exp, index) => (
                      <li key={index}>{exp}</li>
                    ))}
                  </ul>
                </>
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default ResumeBuilder;