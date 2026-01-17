import axios from "axios";
import { authHeaders } from "@/Utils/authHeaders";

export const punchIn = async (payload) => {
  const res = await axios.post("/api/user/punchIn", payload,{ headers: authHeaders() });
  return res.data;
};

export const punchOut = async (payload) => {
  const res = await axios.put("/api/user/punchOut", payload, { headers: authHeaders() });
  return res.data;
};


export const getRecordPunchin=async(id,date)=>{
    const res=await axios.get(`/api/user/punchRecord?_id=${id}&date=${date}`,{headers:authHeaders()});
    return res;
}

export const getPunchReport = async (startDate, endDate) => {
  try {
    const res = await axios.get(
      `/api/user/punchReport?startDate=${startDate}&endDate=${endDate}`,
      { headers: authHeaders() }
    );
    return res.data; // axios already gives you data
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};