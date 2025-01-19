import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../modal/Modal";
import styles from "./SortBy.module.css";

const ProjectsTable = () => {
    const [projectsData, setProjectsData] = useState([]); // Current projects data (sorted)
    const [originalData, setOriginalData] = useState([]); // Original unsorted data
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [sortBy, setSortBy] = useState("default");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // New search query state

    const pageSize = 5;
    const totalPages = Math.ceil(projectsData.length / pageSize);
    const indexOfLastProject = currentPage * pageSize;
    const indexOfFirstProject = indexOfLastProject - pageSize;

    // Filtered and paginated projects
    // const filteredProjects = projectsData.filter(
    //     (project) =>
    //         (project.title && project.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    //         (project["s.no"] && project["s.no"].toString().includes(searchQuery))
    // );

    const filteredProjects = projectsData.filter((project) => {
        const titleMatch = project.title && project.title.toLowerCase().includes(searchQuery.toLowerCase());
        const sNoMatch = project["s.no"] && project["s.no"].toString().includes(searchQuery);
        return titleMatch || sNoMatch;
    });
    

    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    // Padding rows if needed for pagination
    const paddedProjects = [...currentProjects];
    while (paddedProjects.length < pageSize) {
        paddedProjects.push({});
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json"
                );
                setOriginalData(response.data); // Store original unsorted data
                setProjectsData(response.data); // Set initial projects data
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Sorting logic
    const sortData = (key, direction) => {
        const sortedData = [...projectsData].sort((a, b) => {
            if (a[key] === undefined || b[key] === undefined) return 0;
            return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
        });
        setProjectsData(sortedData);
        setSortConfig({ key, direction });
    };

    // Handle sorting based on selected value in dropdown
    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);

        if (value === "default") {
            setProjectsData(originalData); // Reset to the original data (unsorted)
        } else if (value === "percentage.funded-low-high") {
            sortData("percentage.funded", "asc");
        } else if (value === "percentage.funded-high-low") {
            sortData("percentage.funded", "desc");
        } else if (value === "amt.pledged-low-high") {
            sortData("amt.pledged", "asc");
        } else if (value === "amt.pledged-high-low") {
            sortData("amt.pledged", "desc");
        }
    };

    // Pagination controls
    const firstPage = () => setCurrentPage(1);
    const lastPage = () => setCurrentPage(totalPages);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const openModal = (project) => {
        setSelectedProject(project);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProject(null);
    };

    return (
        <div>
            <div className="search-sort-container">
                {/* Search Input */}
                <div className="search-container" style={{ marginBottom: "15px" }}>
                    <label htmlFor="search">Search: </label>
                    <input
                        id="search"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title or s.no"
                    />
                </div>

                {/* Sort By Dropdown */}
                <div className={styles.sortByContainer} style={{ marginBottom: "15px" }}>
                    <label className={styles.sortByLabel} htmlFor="sortBy">Sort By: </label>
                    <select
                        id="sortBy"
                        className={styles.sortBySelect}
                        value={sortBy}
                        onChange={handleSortChange}
                    >
                        <option value="default">Relevant (Default)</option>
                        <option value="percentage.funded-low-high">Percentage Funded (Low to High)</option>
                        <option value="percentage.funded-high-low">Percentage Funded (High to Low)</option>
                        <option value="amt.pledged-low-high">Amount Pledged (Low to High)</option>
                        <option value="amt.pledged-high-low">Amount Pledged (High to Low)</option>
                    </select>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>S.No.</th>
                        <th>Percentage Funded</th>
                        <th>Amount Pledged</th>
                    </tr>
                </thead>
                <tbody>
                    {paddedProjects.map((project, index) => (
                        <tr
                            key={index}
                            onClick={() => (project.title ? openModal(project) : null)}
                            className={project.title ? styles.clickableRow : styles.nonClickableRow}
                        >
                            <td>{project["s.no"] !== undefined && project["s.no"] !== null ? project["s.no"] : "\u00A0"}</td>
                            <td>{project["percentage.funded"] ? `${project["percentage.funded"]}%` : "\u00A0"}</td>
                            <td>{project.currency?.toUpperCase()} {project["amt.pledged"] || "\u00A0"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={firstPage} disabled={currentPage === 1}><i class="fa fa-angle-double-left"></i></button>
                <button onClick={prevPage} disabled={currentPage === 1}><i class="fa fa-angle-left"></i></button>
                <span>{currentPage} of {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages}><i class="fa fa-angle-right"></i></button>
                <button onClick={lastPage} disabled={currentPage === totalPages}><i class="fa fa-angle-double-right"></i></button>
            </div>

            {/* Show the Modal if modalOpen is true */}
            {modalOpen && <Modal project={selectedProject} closeModal={closeModal} />}
        </div>
    );
};

export default ProjectsTable;
