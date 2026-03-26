const API_BASE = "https://mts3ow3lb2.execute-api.eu-central-1.amazonaws.com/dev";

export async function fetchAllgrades(API,  email, role, route ) {
      let APIPath;

      if (route === "subject") {
        APIPath = "/subject";
      } else if (route === "allGrades") {
        if (role === "Teachers" && email) {
          APIPath = `/all-grades?studentEmail=${encodeURIComponent(email)}`;
        } else {
          APIPath = "/all-grades";
        }
      }

      const idToken = localStorage.getItem("idToken");
      const response = await fetch(`${API}${APIPath}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const resData = await response.json();

      if (resData.body && typeof resData.body === "string") {
        return JSON.parse(resData.body);
      }
      if (Array.isArray(resData)) return resData;

      return [];
}

// ---------------------- Add grade ----------------------
export async function addGrade(studentEmail, subj, grade) {
  const idToken = localStorage.getItem("idToken");
  const res = await fetch(`${API_BASE}/add-grades`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ studentEmail, subj, grade }),
  });
  return res.json();
}

// ---------------------- Edit grade ----------------------
export async function editGrade(studentEmail, subj, grade, newGrade) {
  const idToken = localStorage.getItem("idToken");
  const res = await fetch(`${API_BASE}/edit-grade`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ studentEmail, subj, grade, newGrade }),
  });
  return res.json();
}

// ---------------------- Delete grade ----------------------
export async function deleteGrade(studentEmail, subj, grade) {
  const idToken = localStorage.getItem("idToken");
  const res = await fetch(`${API_BASE}/delete-grade`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ studentEmail, subj, grade }),
  });
  return res.json();
}
