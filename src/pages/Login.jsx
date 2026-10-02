import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Invalid email or password");
            }

            console.log("Login successful!");
            console.log(data);

            // Store JWT and user information
            localStorage.setItem("token", data.token);
            localStorage.setItem("email", data.email);
            localStorage.setItem("role", data.role);

            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {

            console.error("Login error:", error);

            setError(error.message);
        }
    };

    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "400px",
                margin: "50px auto"
            }}
        >

            <h1>PlaceIQ Login</h1>

            <form onSubmit={handleLogin}>

                <div style={{ marginBottom: "20px" }}>

                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px"
                        }}
                    />

                </div>

                <div style={{ marginBottom: "20px" }}>

                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px"
                        }}
                    />

                </div>

                {error && (
                    <p
                        style={{
                            color: "red",
                            marginBottom: "15px"
                        }}
                    >
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    style={{
                        padding: "12px 25px",
                        cursor: "pointer",
                        border: "none",
                        borderRadius: "6px",
                        backgroundColor: "#4f46e5",
                        color: "white",
                        fontSize: "16px"
                    }}
                >
                    Login
                </button>

            </form>

        </div>
    );
}

export default Login;