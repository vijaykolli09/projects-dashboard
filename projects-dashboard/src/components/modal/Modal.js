import React from "react";
import styles from "./Modal.module.css"; // Update the path if necessary

const Modal = ({ project, closeModal }) => {
  if (!project) return null; // If no project data is passed, return nothing

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Close button inside the modal */}
        <button className={styles.closeButton} onClick={closeModal}>
          &times; {/* This is the "×" character for closing */}
        </button>

        <h2>Project Details</h2>
        <p><strong>Title:</strong> {project.title}</p>
        <p><strong>S.No:</strong> {project["s.no"]}</p>
        <p><strong>Amount Pledged:</strong> ${project["amt.pledged"].toLocaleString()}</p>
        <p><strong>Percentage Funded:</strong> {project["percentage.funded"]}%</p>
        <p><strong>Number of Backers:</strong> {project["num.backers"]}</p>
        <p><strong>Location:</strong> {project.location}, {project.state}, {project.country}</p>
        <p><strong>Blurb:</strong> {project.blurb}</p>
        <p><strong>End Time:</strong> {new Date(project["end.time"]).toLocaleString()}</p>
        <p><strong>Type:</strong> {project.type}</p>
        <p><strong>URL:</strong> <a href={project.url} target="_blank" rel="noopener noreferrer">View Project</a></p>
      </div>
    </div>
  );
};

export default Modal;
