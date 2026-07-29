import api from "./api";

export const getApplications = () => {
  return api.get("/applications");
};

export const createApplication = (application) => {
  return api.post("/applications", application);
};

export const updateApplication = (id, status) => {
  return api.put(`/applications/${id}`, status, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

export const deleteApplication = (id) => {
  return api.delete(`/applications/${id}`);
};