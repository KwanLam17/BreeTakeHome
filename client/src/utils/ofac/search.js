import axios from "axios";

export const search = async (payload) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_API_URL,
            payload
        );
        return response;
    } catch (e) {
        console.log(e);
        throw e;
    }
};