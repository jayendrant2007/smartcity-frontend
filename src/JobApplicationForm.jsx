import React, { useState } from "react";
import axios from "axios";
import "./JobApplicationForm.css";

function JobApplicationForm() {
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    nric: "",
    dob: "",
    sex: "",
    phone: "",
    address: "",
    vacancySource: "",
    isPR: "",
    prDate: "",
    nationality: "",
    maritalStatus: "",
    passportNo: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    passportIssuedPlace: "",
    workExperience: [{ jobTitle: "", company: "", location: "", fromDate: "", toDate: "" }],
    education: [{ school: "", fieldOfStudy: "", degree: "" }],
    languages: { english: "", chinese: "", mandarin: "", malay: "", tamil: "" },
    position: ""
  });

  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e, index, section) => {
    const { name, value } = e.target;
    if (section === "workExperience") {
      const newExp = [...formData.workExperience];
      newExp[index][name] = value;
      setFormData({ ...formData, workExperience: newExp });
    } else if (section === "education") {
      const newEdu = [...formData.education];
      newEdu[index][name] = value;
      setFormData({ ...formData, education: newEdu });
    } else if (section === "languages") {
      setFormData({ ...formData, languages: { ...formData.languages, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [...formData.workExperience, { jobTitle: "", company: "", location: "", fromDate: "", toDate: "" }]
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { school: "", fieldOfStudy: "", degree: "" }]
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!/^\d{8,15}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 8–15 digits.";
    }
    if (formData.nric.length < 5) {
      newErrors.nric = "NRIC/FIN must be at least 5 characters.";
    }
    Object.entries(formData.languages).forEach(([lang, val]) => {
      if (val && (val < 0 || val > 5)) {
        newErrors[lang] = `${lang} proficiency must be between 0 and 5.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await axios.post("http://localhost:3000/apply", formData);
      setStatus("✅ Application submitted successfully!");
    } catch {
      setStatus("❌ Submission failed. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Job Application Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Position Applied For at the TOP */}
        <input
          name="position"
          placeholder="Position Applied For"
          value={formData.position}
          onChange={handleChange}
          required
        />

        {/* Personal Details */}
        <select name="title" value={formData.title} onChange={handleChange} required>
          <option value="">Title</option>
          <option>Mr</option>
          <option>Ms</option>
          <option>Mdm</option>
        </select>
        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input name="nric" placeholder="NRIC / FIN" value={formData.nric} onChange={handleChange} required />
        {errors.nric && <span className="error">{errors.nric}</span>}
        <input name="dob" type="date" value={formData.dob} onChange={handleChange} required />
        <select name="sex" value={formData.sex} onChange={handleChange} required>
          <option value="">Sex</option>
          <option>Male</option>
          <option>Female</option>
          <option>Transgender</option>
        </select>
        <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        {errors.phone && <span className="error">{errors.phone}</span>}
        <textarea name="address" placeholder="Postal Address" value={formData.address} onChange={handleChange} required />

        {/* Work Experience */}
        <h3>Work Experience</h3>
        {formData.workExperience.map((exp, index) => (
          <div key={index}>
            <input name="jobTitle" placeholder="Job Title" value={exp.jobTitle} onChange={(e) => handleChange(e, index, "workExperience")} />
            <input name="company" placeholder="Company" value={exp.company} onChange={(e) => handleChange(e, index, "workExperience")} />
            <input name="location" placeholder="Location" value={exp.location} onChange={(e) => handleChange(e, index, "workExperience")} />
            <input name="fromDate" type="date" value={exp.fromDate} onChange={(e) => handleChange(e, index, "workExperience")} />
            <input name="toDate" type="date" value={exp.toDate} onChange={(e) => handleChange(e, index, "workExperience")} />
          </div>
        ))}
        <button type="button" className="add-button" onClick={addWorkExperience}>+ Add Work Experience</button>

        {/* Education */}
        <h3>Education</h3>
        {formData.education.map((edu, index) => (
          <div key={index}>
            <input name="school" placeholder="School / University" value={edu.school} onChange={(e) => handleChange(e, index, "education")} />
            <input name="fieldOfStudy" placeholder="Field of Study" value={edu.fieldOfStudy} onChange={(e) => handleChange(e, index, "education")} />
            <select name="degree" value={edu.degree} onChange={(e) => handleChange(e, index, "education")}>
              <option value="">Degree</option>
              <option>High School</option>
              <option>Advanced / Diploma Certificate</option>
              <option>Bachelors Degree / Engineers</option>
              <option>Masters Degree / Engineers</option>
            </select>
          </div>
        ))}
        <button type="button" className="add-button" onClick={addEducation}>+ Add Education</button>

        {/* Languages */}
        <h3>Languages</h3>
        {["english","chinese","mandarin","malay","tamil"].map(lang => (
          <div key={lang}>
            <label>{lang.charAt(0).toUpperCase()+lang.slice(1)} (0-5)</label>
            <input
              name={lang}
              type="number"
              min="0"
              max="5"
              value={formData.languages[lang]}
              onChange={(e) => handleChange(e, null, "languages")}
            />
            {errors[lang] && <span className="error">{errors[lang]}</span>}
          </div>
        ))}

        <button type="submit">Submit Application</button>
      </form>
      {status && <p className="status">{status}</p>}
    </div>
  );
}

export default JobApplicationForm;
