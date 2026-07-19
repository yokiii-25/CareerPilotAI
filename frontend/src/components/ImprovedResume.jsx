import { useEffect, useState } from "react";

const EMPTY_CONTACT = {
  name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
};

const LIST_SECTIONS = [
  { key: "skills", title: "Skills" },
  { key: "education", title: "Education" },
  { key: "experience", title: "Experience" },
  { key: "projects", title: "Projects" },
  { key: "certifications", title: "Certifications" },
  { key: "achievements", title: "Achievements" },
  {
    key: "additional_sections",
    title: "Additional Information",
  },
];

function createDraft(resume) {
  return {
    ...resume,
    contact: {
      ...EMPTY_CONTACT,
      ...(resume?.contact || {}),
    },
    professional_summary:
      resume?.professional_summary || "",
    skills: [...(resume?.skills || [])],
    education: [...(resume?.education || [])],
    experience: [...(resume?.experience || [])],
    projects: [...(resume?.projects || [])],
    certifications: [...(resume?.certifications || [])],
    achievements: [...(resume?.achievements || [])],
    additional_sections: [
      ...(resume?.additional_sections || []),
    ],
    changes_made: [...(resume?.changes_made || [])],
  };
}

function EditableListSection({
  title,
  items,
  isEditing,
  onChangeItem,
  onAddItem,
  onRemoveItem,
}) {
  if (!isEditing && (!items || items.length === 0)) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="border-b border-slate-300 pb-2 text-xl font-bold text-slate-900">
        {title}
      </h2>

      {isEditing ? (
        <div className="mt-4 space-y-3">
          {items.map((item, index) => (
            <div
              key={`${title}-${index}`}
              className="flex gap-3"
            >
              <textarea
                value={item}
                onChange={(event) =>
                  onChangeItem(index, event.target.value)
                }
                rows={2}
                className="min-h-20 flex-1 resize-y rounded-xl border border-slate-300 px-4 py-3 leading-7 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() => onRemoveItem(index)}
                className="self-start rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={onAddItem}
            className="rounded-lg border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            + Add item
          </button>
        </div>
      ) : (
        <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
          {items.map((item, index) => (
            <li
              key={`${title}-${index}`}
              className="leading-7"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ImprovedResume({ resume, onSave }) {
  const [draft, setDraft] = useState(() =>
    createDraft(resume)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] =
    useState("");

  useEffect(() => {
    setDraft(createDraft(resume));
  }, [resume]);

  if (!resume) return null;

  function updateContact(field, value) {
    setDraft((current) => ({
      ...current,
      contact: {
        ...current.contact,
        [field]: value,
      },
    }));
  }

  function updateListItem(section, index, value) {
    setDraft((current) => ({
      ...current,
      [section]: current[section].map(
        (item, itemIndex) =>
          itemIndex === index ? value : item
      ),
    }));
  }

  function addListItem(section) {
    setDraft((current) => ({
      ...current,
      [section]: [...current[section], ""],
    }));
  }

  function removeListItem(section, index) {
    setDraft((current) => ({
      ...current,
      [section]: current[section].filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  }

  function cleanResumeData(data) {
    const cleaned = {
      ...data,
      contact: Object.fromEntries(
        Object.entries(data.contact).map(
          ([key, value]) => [key, value.trim()]
        )
      ),
      professional_summary:
        data.professional_summary.trim(),
    };

    [
      "skills",
      "education",
      "experience",
      "projects",
      "certifications",
      "achievements",
      "additional_sections",
      "changes_made",
    ].forEach((section) => {
      cleaned[section] = (data[section] || [])
        .map((item) => item.trim())
        .filter(Boolean);
    });

    return cleaned;
  }

  function handleSave() {
    const cleanedResume = cleanResumeData(draft);

    setDraft(cleanedResume);
    onSave?.(cleanedResume);
    setIsEditing(false);
    setStatusMessage("Resume changes saved.");

    setTimeout(() => {
      setStatusMessage("");
    }, 3000);
  }

  function handleCancel() {
    setDraft(createDraft(resume));
    setIsEditing(false);
    setStatusMessage("");
  }

  function buildPlainTextResume() {
    const lines = [];
    const contact = draft.contact || {};

    lines.push(contact.name || "Candidate");

    const contactDetails = [
      contact.email,
      contact.phone,
      contact.location,
      contact.linkedin,
      contact.github,
      contact.portfolio,
    ].filter(Boolean);

    if (contactDetails.length) {
      lines.push(contactDetails.join(" | "));
    }

    if (draft.professional_summary) {
      lines.push(
        "",
        "PROFESSIONAL SUMMARY",
        draft.professional_summary
      );
    }

    LIST_SECTIONS.forEach(({ key, title }) => {
      const items = draft[key] || [];

      if (items.length) {
        lines.push("", title.toUpperCase());

        items.forEach((item) => {
          if (item.trim()) {
            lines.push(`• ${item.trim()}`);
          }
        });
      }
    });

    return lines.join("\n");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        buildPlainTextResume()
      );

      setStatusMessage("Resume copied to clipboard.");
    } catch (error) {
      console.error("Copy failed:", error);
      setStatusMessage(
        "Unable to copy the resume automatically."
      );
    }

    setTimeout(() => {
      setStatusMessage("");
    }, 3000);
  }

  function handleDownloadPdf() {
    window.print();
  }

  const contact = draft.contact || EMPTY_CONTACT;

  return (
    <section
      id="improved-resume"
      className="mx-auto max-w-5xl scroll-mt-24 px-6 py-16"
    >
      <div className="mb-6 flex flex-col gap-4 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Improved Resume
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Review and customize your resume
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Edit Resume
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="rounded-xl border border-blue-300 bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Copy
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Download PDF
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-green-700 print:hidden">
          {statusMessage}
        </div>
      )}

      <article className="rounded-3xl bg-white p-7 shadow-xl print:rounded-none print:p-0 print:shadow-none md:p-12">
        <header className="flex flex-col gap-6 border-b border-slate-300 pb-8 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            {isEditing ? (
              <input
                value={contact.name}
                onChange={(event) =>
                  updateContact(
                    "name",
                    event.target.value
                  )
                }
                placeholder="Candidate name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-3xl font-bold text-slate-900 outline-none focus:border-blue-500"
              />
            ) : (
              <h1 className="text-4xl font-bold text-slate-900">
                {contact.name || "Candidate"}
              </h1>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {Object.entries({
                email: "Email",
                phone: "Phone",
                location: "Location",
                linkedin: "LinkedIn",
                github: "GitHub",
                portfolio: "Portfolio",
              }).map(([field, label]) =>
                isEditing ? (
                  <input
                    key={field}
                    value={contact[field] || ""}
                    onChange={(event) =>
                      updateContact(
                        field,
                        event.target.value
                      )
                    }
                    placeholder={label}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                ) : (
                  contact[field] && (
                    <p
                      key={field}
                      className="break-words text-sm text-slate-600"
                    >
                      {contact[field]}
                    </p>
                  )
                )
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-green-100 px-6 py-5 text-center print:border print:border-slate-300 print:bg-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Estimated ATS
            </p>

            <p className="mt-2 text-4xl font-bold text-green-700">
              {draft.estimated_ats_score || 0}%
            </p>
          </div>
        </header>

        <section className="mt-8">
          <h2 className="border-b border-slate-300 pb-2 text-xl font-bold text-slate-900">
            Professional Summary
          </h2>

          {isEditing ? (
            <textarea
              value={draft.professional_summary}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  professional_summary:
                    event.target.value,
                }))
              }
              rows={5}
              className="mt-4 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 leading-7 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          ) : (
            <p className="mt-4 leading-8 text-slate-700">
              {draft.professional_summary ||
                "No professional summary available."}
            </p>
          )}
        </section>

        {LIST_SECTIONS.map(({ key, title }) => (
          <EditableListSection
            key={key}
            title={title}
            items={draft[key] || []}
            isEditing={isEditing}
            onChangeItem={(index, value) =>
              updateListItem(key, index, value)
            }
            onAddItem={() => addListItem(key)}
            onRemoveItem={(index) =>
              removeListItem(key, index)
            }
          />
        ))}

        {!isEditing &&
          draft.changes_made?.length > 0 && (
            <aside className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-6 print:hidden">
              <h2 className="text-lg font-bold text-slate-900">
                AI Improvements Made
              </h2>

              <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
                {draft.changes_made.map(
                  (change, index) => (
                    <li key={index}>{change}</li>
                  )
                )}
              </ul>
            </aside>
          )}
      </article>

      <p className="mt-4 text-center text-sm text-slate-500 print:hidden">
        Select “Save as PDF” in the print window to
        download your resume.
      </p>
    </section>
  );
}

export default ImprovedResume;