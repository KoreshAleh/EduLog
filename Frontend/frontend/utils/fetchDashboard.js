

export async function fetchDashboard(API, route) {
    let APIPath;
      if (route === "grades") APIPath = "/grades";
      else if (route === "average") APIPath = "/average-grades";
      else if (route === "allStudents") APIPath = "/get-students";
      else if (route === "subject") APIPath = "/subject";

      const idToken = localStorage.getItem("idToken");
      const response = await fetch(`${API}${APIPath}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      // Handle JSON or text responses safely
      const raw = await response.text();
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        console.warn("Response is not valid JSON:", raw);
        return [];
      }

      if (parsed.body) {
        try {
          return JSON.parse(parsed.body);
        } catch {
          return [];
        }
      }

      if (Array.isArray(parsed)) return parsed;
}


