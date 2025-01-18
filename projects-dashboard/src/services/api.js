
import axios from "axios";

const fetchRecords = async () => {
    const response = await axios.get("https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json")
    return response.data
}

export default fetchRecords;