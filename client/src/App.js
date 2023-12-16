import { useEffect, useState } from "react";
import { search } from "./utils/ofac/search";

import "./App.css";

function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [country, setCountry] = useState("");
    const [responseData, setResponseData] = useState(undefined);

    useEffect(() => {
        if (!responseData) {
            return;
        }

        alert(responseData?.hit ? "Hit" : "Clear");
    }, [responseData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            setResponseData(undefined);
            const response = await search({ name, dob, country });
            setResponseData(response.data);
        } catch (e) {
            // placeholder to handle errors
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="App">
            <form className="app-form" onSubmit={handleSubmit}>
                <label>
                    Enter your full name:
                    <input
                        type="text"
                        value={name}
                        required
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                    />
                </label>
                <label>
                    Enter your birth year:
                    <input
                        type="date"
                        value={dob}
                        required
                        onChange={(e) => setDob(e.target.value)}
                        disabled={isLoading}
                    />
                </label>
                <label>
                    Enter your country:
                    <input
                        type="text"
                        value={country}
                        required
                        onChange={(e) => setCountry(e.target.value)}
                        disabled={isLoading}
                    />
                </label>
                <input type="submit" value="Submit" disabled={isLoading} />
            </form>
            {isLoading && <div class="loader"></div>}
            {!isLoading && responseData?.hit && (
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    Name:{" "}
                                    {responseData?.nameMatch ? "✅" : "❌"}
                                </td>
                                <td>
                                    DoB: {responseData?.dobMatch ? "✅" : "❌"}
                                </td>
                                <td>
                                    Country:{" "}
                                    {responseData?.countryMatch ? "✅" : "❌"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default App;
