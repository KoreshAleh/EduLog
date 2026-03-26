const API_BASE = "https://mts3ow3lb2.execute-api.eu-central-1.amazonaws.com/dev";

// ---------------------- Fetch grades ----------------------
export async function fetchGrades(API, decodedEmail, route) {
  let APIPath;
  if (route === "grades") {
    APIPath = `/grades?studentEmail=${encodeURIComponent(decodedEmail)}`;
  } else if (route === "average") {
    APIPath = `/average-grades?studentEmail=${encodeURIComponent(decodedEmail)}`;
  } else if (route === "subject") {
    APIPath = "/subject";
  }

  if (!APIPath) return [];

  const idToken = localStorage.getItem("idToken");
  if (!idToken) return [];

  const res = await fetch(`${API}${APIPath}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  let parsed = [];

  if (typeof data.body === "string") {
    try {
      parsed = JSON.parse(data.body);
    } catch {
      parsed = [];
    }
  } else if (Array.isArray(data)) {
    parsed = data;
  }

  return parsed;
}

