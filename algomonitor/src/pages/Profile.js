import { useState, useEffect } from "react";

export default function Profile() {

  const [handles, setHandles] = useState({
    leetcode: "",
    codeforces: "",
    codechef: ""
  });

  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  /* Load handles from backend */
useEffect(() => {

  const user = JSON.parse(localStorage.getItem("user"));

  const loadHandles = async () => {

    try {

      const res = await fetch(
        `http://localhost:5000/profile/handles/${user._id}`
      );

      const data = await res.json();

      setHandles({
        leetcode: data.leetcode || "",
        codeforces: data.codeforces || "",
        codechef: data.codechef || ""
      });

    } catch (err) {

      console.log("Error loading handles", err);

    }

  };

  if (user) loadHandles();

}, []);

 

  const handleChange = (e) => {
    setHandles({
      ...handles,
      [e.target.name]: e.target.value
    });
  };

  /* VALIDATIONS */

  const validateCodeforces = async (handle) => {
    try {
      const res = await fetch(
        `https://codeforces.com/api/user.info?handles=${handle}`
      );

      const data = await res.json();

      return data.status === "OK";

    } catch {
      return false;
    }
  };

  const validateLeetcode = async (handle) => {
    try {

      const res = await fetch(
        "https://corsproxy.io/?url=https://leetcode.com/graphql",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query getUserProfile($username: String!) {
              matchedUser(username: $username) {
                username
              }
            }
            `,
            variables: { username: handle }
          })
        }
      );

      const result = await res.json();

      return result?.data?.matchedUser !== null;

    } catch {
      return false;
    }
  };

  const validateCodechef = async (handle) => {

    try {

      const res = await fetch(
        `https://corsproxy.io/?https://www.codechef.com/users/${handle}`
      );

      const text = await res.text();

      return text.includes("user-details");

    } catch {
      return false;
    }

  };

  /* SAVE HANDLES */

  const saveHandles = async () => {

    const { leetcode, codeforces, codechef } = handles;

    if (!leetcode && !codeforces && !codechef) {
      alert("⚠️ Enter at least one handle");
      return;
    }

    setLoading(true);

    try {

      if (codeforces && !(await validateCodeforces(codeforces))) {
        alert("❌ Invalid Codeforces handle");
        setLoading(false);
        return;
      }

      if (leetcode && !(await validateLeetcode(leetcode))) {
        alert("❌ Invalid LeetCode handle");
        setLoading(false);
        return;
      }

      if (codechef && !(await validateCodechef(codechef))) {
        alert("❌ Invalid CodeChef handle");
        setLoading(false);
        return;
      }

      await fetch("http://localhost:5000/profile/handles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email,
          ...handles
        })
      });

      alert("✅ Handles saved successfully");

    } catch (err) {

      console.log(err);
      alert("❌ Error saving handles");

    }

    setLoading(false);

  };

  return (

<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">

<div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

<h2 className="text-2xl font-bold text-center mb-8 text-gray-700">
Coding Profile
</h2>

<div className="space-y-5">

<input
type="text"
name="leetcode"
placeholder="LeetCode Username"
value={handles.leetcode}
onChange={handleChange}
className="w-full h-11 px-4 bg-gray-700 text-white placeholder-gray-300 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400"
/>

<input
type="text"
name="codeforces"
placeholder="Codeforces Username"
value={handles.codeforces}
onChange={handleChange}
className="w-full h-11 px-4 bg-gray-700 text-white placeholder-gray-300 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400"
/>

<input
type="text"
name="codechef"
placeholder="CodeChef Username"
value={handles.codechef}
onChange={handleChange}
className="w-full h-11 px-4 bg-gray-700 text-white placeholder-gray-300 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400"
/>

<button
onClick={saveHandles}
disabled={loading}
className="w-full h-11 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
>
{loading ? "Validating..." : "Save Handles"}
</button>

</div>

</div>
</div>

  );
}