import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/profile.css";

export default function Profile() {
  const email = localStorage.getItem("email") || "";
  const mobile = localStorage.getItem("mobile") || "";

  const [profile, setProfile] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    address: "",
    pan: "",
    aadhaar: ""
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [aadhaarFile, setAadhaarFile] = useState(null);

  const [kycStatus, setKycStatus] = useState("Not Verified");
  const [loading, setLoading] = useState(false);

  /* ======================
     SAFE MASK FUNCTION
  ====================== */
  const mask = (value = "", visible = 4) => {
    if (!value) return "";
    if (value.length <= visible) return value;
    return "*".repeat(value.length - visible) + value.slice(-visible);
  };

  /* ======================
     LOAD KYC STATUS (OPTIONAL)
  ====================== */
  useEffect(() => {
    // Example:
    // API.get("/kyc/status").then(res => setKycStatus(res.data.status));
  }, []);

  /* ======================
     HANDLERS
  ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const uploadPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  /* ======================
     SUBMIT KYC
  ====================== */
  const submitProfile = async () => {
    if (
      !profile.firstName ||
      !profile.lastName ||
      !profile.pan ||
      !profile.aadhaar ||
      !panFile ||
      !aadhaarFile
    ) {
      alert("Please complete all mandatory KYC fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(profile).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (photoFile) formData.append("photo", photoFile);
      formData.append("panFile", panFile);
      formData.append("aadhaarFile", aadhaarFile);

      await API.post("/kyc/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("KYC submitted successfully");
      setKycStatus("Pending");

    } catch (err) {
      console.error(err);
      alert("KYC submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">

        <h2>Profile & KYC</h2>
        <p className="subtitle">
          Complete your KYC to unlock all banking features
        </p>

        {/* PROFILE PHOTO */}
        <div className="photo-section">
          <div className="photo-box">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" />
            ) : (
              <span className="photo-placeholder">👤</span>
            )}
          </div>

          <label className="upload-btn">
            Upload Photo
            <input type="file" accept="image/*" hidden onChange={uploadPhoto} />
          </label>
        </div>

        {/* PERSONAL DETAILS */}
        <div className="section">
          <h3>Personal Details</h3>

          <div className="grid-3">
            <input name="firstName" placeholder="First Name" value={profile.firstName} onChange={handleChange} />
            <input name="middleName" placeholder="Middle Name" value={profile.middleName} onChange={handleChange} />
            <input name="lastName" placeholder="Last Name" value={profile.lastName} onChange={handleChange} />
          </div>

          <div className="grid-2">
            <input value={email} disabled />
            <input value={`+91 ${mobile}`} disabled />
          </div>

          <input type="date" name="dob" value={profile.dob} onChange={handleChange} />

          <textarea
            name="address"
            placeholder="Residential Address"
            rows="3"
            value={profile.address}
            onChange={handleChange}
          />
        </div>

        {/* KYC DETAILS */}
        <div className="section">
          <h3>KYC Details</h3>

          <div className="kyc-status">
            Status:
            <span className={`status ${kycStatus.toLowerCase().replace(" ", "-")}`}>
              {kycStatus}
            </span>
          </div>

          <input name="pan" placeholder="PAN Number" value={profile.pan} onChange={handleChange} />
          <input name="aadhaar" placeholder="Aadhaar Number" value={profile.aadhaar} onChange={handleChange} />

          {(profile.pan || profile.aadhaar) && (
            <div className="subtitle">
              PAN: {mask(profile.pan)} | Aadhaar: {mask(profile.aadhaar)}
            </div>
          )}

          <div className="upload-row">
            <label className="upload-box">
              Upload PAN Card
              <input type="file" hidden accept="image/*,application/pdf" onChange={(e) => setPanFile(e.target.files[0])} />
              {panFile && <span>{panFile.name}</span>}
            </label>

            <label className="upload-box">
              Upload Aadhaar
              <input type="file" hidden accept="image/*,application/pdf" onChange={(e) => setAadhaarFile(e.target.files[0])} />
              {aadhaarFile && <span>{aadhaarFile.name}</span>}
            </label>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="actions">
          <button className="primary" onClick={submitProfile} disabled={loading}>
            {loading ? "Submitting..." : "Save & Submit KYC"}
          </button>
          <button className="secondary" disabled>
            View Verification Status
          </button>
        </div>

      </div>
    </div>
  );
}
