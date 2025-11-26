import { useState } from "react";
import { useAppDispatch } from './hooks';
import { createJob } from './dataSlice';

type NewJobDialogProps = {
    onClose: () => void;
};

const NewJobDialog = ({ onClose }: NewJobDialogProps) => {
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [status, setStatus] = useState("applied");
    const [website, setWebsite] = useState("");
    const [notes, setNotes] = useState("");
    const [details, setDetails] = useState("");
    const [description, setDescription] = useState("");

    const today = new Date().toISOString().split("T")[0];
    const [appliedDate, setAppliedDate] = useState(today);

    // AI Job Description Parser
    const handleParseDescription = async () => {
        if (!description.trim()) return;

        try {
            const response = await fetch("http://localhost:8000/parsejob", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description }),
            });

            const data = await response.json();

            // Expected from backend:
            // { "company", "position", "description_summary", "required_skills", "description_details" }
            if (data.company) setCompany(data.company);
            if (data.position) setTitle(data.position);
            if (data.description_summary || data.required_skills) {
                const reqs = `Summary: ${data.description_summary || "N/A"}\n\nRequirements:\n- ${data.required_skills ? data.required_skills.join("\n- ") : "N/A"}`;
                setNotes(reqs);
            }
            if (data.description_details) {
                setDetails(data.description_details);
            } else {
                setDetails("Details not available");
            }
        } catch (err) {
            console.error("Error parsing description:", err);
        }
    };

    // Form submission handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(
            createJob({
                title,
                company,
                status,
                website,
                notes,
                details: description,
                applied_date: appliedDate,
                updated_date: appliedDate,
            })
        );
        onClose();
    };

    return (
        <>
            <div className="backdrop" onClick={onClose} />
            <div className="dialog">
                <h2>New Job Application</h2>

                <form className="dialog-content" onSubmit={handleSubmit}>

                    {/* --- AI Job Description Parser --- */}
                    <div className="input-container dialog-item">
                        <label htmlFor="description-field">Paste Job Description</label>
                        <textarea
                            id="description-field"
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <button type="button" onClick={handleParseDescription}>
                            Parse with AI
                        </button>
                    </div>

                    {/* --- Form Fields for Job Creation --- */}
                    <div className="input-container dialog-item">
                        <label htmlFor="company-field">Company</label>
                        <input
                            type="text"
                            id="company-field"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                        />
                    </div>

                    <div className="input-container dialog-item">
                        <label htmlFor="title-field">Job Title</label>
                        <input
                            type="text"
                            id="title-field"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="input-container dialog-item">
                        <label htmlFor="website-field">Website</label>
                        <input
                            type="text"
                            id="website-field"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </div>

                    <div className="input-container dialog-item">
                        <label htmlFor="applied-date-field">Applied Date</label>
                        <input
                            type="date"
                            id="applied-date-field"
                            value={appliedDate}
                            onChange={(e) => setAppliedDate(e.target.value)}
                        />
                    </div>

                    <div className="input-container dialog-item">
                        <label htmlFor="status-field">Status</label>
                        <select
                            id="status-field"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="applied">Applied</option>
                            <option value="interview">Interview</option>
                            <option value="offer">Offer</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="input-container dialog-item">
                        <label htmlFor="notes-field">Notes / Requirements</label>
                        <textarea
                            id="notes-field"
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="input-container dialog-item">
                        <label htmlFor="details-field">Details as HTML</label>
                        <textarea
                            id="details-field"
                            rows={4}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        />
                    </div>

                    <div className="dialog-item">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </>
    );
};

export default NewJobDialog;
